const { pool } = require('../config/database');
const tenantService = require('./tenant.service');

// Parámetros de configuración por defecto para el protocolo iClock
const ZKTECO_ALLOW_AUTO_REGISTER = process.env.ZKTECO_ALLOW_AUTO_REGISTER !== 'false';

/**
 * Registra o actualiza el estado de un dispositivo biométrico en la base de datos
 */
async function registerOrUpdateDevice(serialNumber, model = 'Desconocido') {
  const cleanSerial = serialNumber.trim();
  
  // Buscar si ya existe el biométrico
  const existingResult = await pool.query(
    'SELECT * FROM biometricos WHERE serial = $1 LIMIT 1',
    [cleanSerial]
  );
  
  const now = new Date();
  
  if (existingResult.rows.length > 0) {
    // Si existe, actualizar estado y último sync
    const device = existingResult.rows[0];
    await pool.query(
      `UPDATE biometricos 
       SET estado = 'online', ultimo_sync = $1, actualizado_en = $1 
       WHERE id = $2`,
      [now, device.id]
    );
    return device;
  } else if (ZKTECO_ALLOW_AUTO_REGISTER) {
    // Si no existe y se permite autoregistro, buscar la empresa por defecto (monoempresa)
    const defaultEmpresa = await tenantService.findFirstActiveEmpresa();
    if (!defaultEmpresa) {
      throw new Error('No se encontró una empresa activa para registrar el biométrico.');
    }
    
    // Crear el biométrico asociado a la empresa por defecto y sin sucursal asignada (se asigna luego en dashboard)
    const insertResult = await pool.query(
      `INSERT INTO biometricos (empresa_id, nombre, modelo, serial, estado, ultimo_sync)
       VALUES ($1, $2, $3, $4, 'online', $5)
       RETURNING *`,
      [
        defaultEmpresa.id,
        `Biométrico SN: ${cleanSerial}`,
        model,
        cleanSerial,
        now
      ]
    );
    return insertResult.rows[0];
  } else {
    throw new Error(`El dispositivo biométrico con serial ${cleanSerial} no está registrado y el auto-registro está deshabilitado.`);
  }
}

/**
 * Registra un log de auditoría específico de ZKTeco
 */
async function logZktecoEvent(serial, tipo, contenido) {
  try {
    await pool.query(
      'INSERT INTO zkteco_logs (biometrico_serial, tipo, contenido) VALUES ($1, $2, $3)',
      [serial, tipo, typeof contenido === 'object' ? JSON.stringify(contenido) : contenido]
    );
  } catch (error) {
    console.error('Error al guardar log de ZKTeco:', error);
  }
}

/**
 * Retorna las opciones de inicialización en texto plano requeridas por ZKTeco ADMS
 */
async function getDeviceInitOptions(serialNumber) {
  await registerOrUpdateDevice(serialNumber);
  await logZktecoEvent(serialNumber, 'handshake', 'Handshake inicial (GET cdata)');

  // Generar timestamp único para control
  const stamp = Math.floor(Date.now() / 1000);

  // Formato de texto plano con retornos de carro requeridos por ZKTeco
  return [
    `GET OPTION FROM: ${serialNumber}`,
    `Stamp=${stamp}`,
    `OpStamp=1`,
    `ErrorDelay=60`,
    `Delay=30`,
    `TransTimes=00:00;14:05`,
    `TransInterval=1`,
    `TransFlag=1111000000`,
    `Realtime=1`,
    `Encrypt=0`
  ].join('\r\n') + '\r\n';
}

/**
 * Parsea y almacena las marcaciones recibidas en el body (ATTLOG)
 */
async function processAttlog(serialNumber, rawBody) {
  if (!rawBody || typeof rawBody !== 'string') {
    throw new Error('Body de ATTLOG vacío o inválido');
  }

  // Asegurar registro de dispositivo
  const device = await registerOrUpdateDevice(serialNumber);
  await logZktecoEvent(serialNumber, 'attlog_received', `Recibido lote de datos. Tamaño: ${rawBody.length} bytes`);

  const lines = rawBody.split(/\r?\n/);
  let creadas = 0;
  let duplicadas = 0;
  let errores = [];

  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    // Formato típico: PIN \t TIME \t STATUS \t VERIFY \t ...
    const parts = cleanLine.split(/\s+/); // soporta tabs o múltiples espacios
    if (parts.length < 2) {
      errores.push(`Línea inválida (faltan campos): ${cleanLine}`);
      continue;
    }

    const pin = parts[0]; // Código del empleado en el biométrico
    const rawTime = parts.slice(1, 3).join(' '); // A veces la fecha y la hora vienen separadas por espacio
    
    let timeStr = '';
    let status = '0'; // default Clock In (entrada)
    let verify = '1'; // default Fingerprint

    // Si viene en formato: PIN [tab] YYYY-MM-DD HH:MM:SS [tab] STATUS [tab] VERIFY
    if (parts.length >= 3 && /^\d{4}-\d{2}-\d{2}$/.test(parts[1]) && /^\d{2}:\d{2}:\d{2}$/.test(parts[2])) {
      timeStr = `${parts[1]} ${parts[2]}`;
      status = parts[3] || '0';
      verify = parts[4] || '1';
    } else {
      // Intenta parsing general
      timeStr = parts[1];
      status = parts[2] || '0';
      verify = parts[3] || '1';
    }

    // Validar fecha
    const parsedDate = new Date(timeStr.replace(/-/g, '/')); // Reemplazar guiones para compatibilidad de parseo
    if (isNaN(parsedDate.getTime())) {
      // Si falló, intentar parsear directamente
      const fallbackDate = new Date(timeStr);
      if (isNaN(fallbackDate.getTime())) {
        errores.push(`Fecha inválida: ${timeStr} en línea: ${cleanLine}`);
        continue;
      }
    }

    try {
      // Insertar en marcaciones_biometricas
      const result = await pool.query(
        `INSERT INTO marcaciones_biometricas (
          biometrico_serial,
          empleado_codigo,
          fecha_hora,
          estado,
          verificacion,
          raw_data
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (biometrico_serial, empleado_codigo, fecha_hora) DO NOTHING
        RETURNING id`,
        [
          serialNumber,
          pin,
          timeStr,
          status,
          verify,
          cleanLine
        ]
      );

      if (result.rows.length > 0) {
        creadas++;
      } else {
        duplicadas++;
      }
    } catch (dbError) {
      console.error(`Error al insertar marcación biométrica (${cleanLine}):`, dbError);
      errores.push(`DB Error para PIN ${pin} a las ${timeStr}: ${dbError.message}`);
    }
  }

  const resumen = {
    total_lineas: lines.length,
    procesadas: creadas,
    duplicadas,
    errores_cantidad: errores.length,
    errores: errores.slice(0, 10) // Limitar logs para no saturar
  };

  await logZktecoEvent(serialNumber, 'attlog_processed', resumen);
  return resumen;
}

/**
 * Listar registros de marcaciones biométricas crudas (logs) para una empresa
 */
async function listMarcacionesBiometricas(empresaId, filters = {}) {
  const { procesado, serial, empleadoCodigo, fechaDesde, fechaHasta, limit = 50, offset = 0 } = filters;
  
  const values = [empresaId];
  const conditions = ['b.empresa_id = $1'];

  if (procesado !== undefined && procesado !== '') {
    values.push(procesado === 'true' || procesado === true);
    conditions.push(`mb.procesado = $${values.length}`);
  }

  if (serial) {
    values.push(serial);
    conditions.push(`mb.biometrico_serial = $${values.length}`);
  }

  if (empleadoCodigo) {
    values.push(empleadoCodigo);
    conditions.push(`mb.empleado_codigo = $${values.length}`);
  }

  if (fechaDesde) {
    values.push(fechaDesde);
    conditions.push(`mb.fecha_hora >= $${values.length}`);
  }

  if (fechaHasta) {
    values.push(fechaHasta);
    conditions.push(`mb.fecha_hora <= $${values.length}`);
  }

  // Count query
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM marcaciones_biometricas mb
     INNER JOIN biometricos b ON b.serial = mb.biometrico_serial
     WHERE ${conditions.join(' AND ')}`,
    values
  );

  // Pagination params
  values.push(Number(limit));
  const limitIndex = values.length;
  values.push(Number(offset));
  const offsetIndex = values.length;

  // Select query
  const selectResult = await pool.query(
    `SELECT mb.*, b.nombre AS biometrico_nombre, e.nombres AS empleado_nombres, e.apellidos AS empleado_apellidos
     FROM marcaciones_biometricas mb
     INNER JOIN biometricos b ON b.serial = mb.biometrico_serial
     LEFT JOIN empleados e ON e.codigo = mb.empleado_codigo AND e.empresa_id = b.empresa_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY mb.fecha_hora DESC
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    values
  );

  return {
    total: countResult.rows[0]?.total || 0,
    items: selectResult.rows
  };
}

/**
 * Obtener un registro individual de marcación biométrica validando empresa
 */
async function findMarcacionBiometricaById(empresaId, id) {
  const result = await pool.query(
    `SELECT mb.*, b.nombre AS biometrico_nombre, b.empresa_id
     FROM marcaciones_biometricas mb
     INNER JOIN biometricos b ON b.serial = mb.biometrico_serial
     WHERE b.empresa_id = $1 AND mb.id = $2
     LIMIT 1`,
    [empresaId, id]
  );
  return result.rows[0] || null;
}

module.exports = {
  getDeviceInitOptions,
  processAttlog,
  registerOrUpdateDevice,
  logZktecoEvent,
  listMarcacionesBiometricas,
  findMarcacionBiometricaById
};
