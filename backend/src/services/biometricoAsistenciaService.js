const { pool } = require('../config/database');

/**
 * Busca el horario activo de un empleado en una fecha determinada
 */
async function findActiveHorario(empresaId, empleadoId, fechaHora) {
  const result = await pool.query(
    `
      SELECT h.*
      FROM empleado_horarios eh
      INNER JOIN horarios h ON h.id = eh.horario_id
      WHERE eh.empresa_id = $1
        AND eh.empleado_id = $2
        AND eh.activo = TRUE
        AND h.activo = TRUE
        AND eh.fecha_inicio <= $3::date
        AND (eh.fecha_fin IS NULL OR eh.fecha_fin >= $3::date)
      ORDER BY eh.fecha_inicio DESC, eh.creado_en DESC
      LIMIT 1
    `,
    [empresaId, empleadoId, fechaHora]
  );

  return result.rows[0] || null;
}

/**
 * Procesa un registro individual de marcaciones_biometricas para crear su marcación real en AsistePro
 */
async function procesarMarcacionBiometrica(biometricaId) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Obtener la marcación biométrica raw
    const rawResult = await client.query(
      `SELECT mb.*, b.empresa_id, b.sucursal_id AS biometrico_sucursal_id
       FROM marcaciones_biometricas mb
       INNER JOIN biometricos b ON b.serial = mb.biometrico_serial
       WHERE mb.id = $1 AND mb.procesado = FALSE
       FOR UPDATE`,
      [biometricaId]
    );

    if (rawResult.rows.length === 0) {
      await client.query('COMMIT');
      return { ok: false, message: 'Marcación no encontrada o ya procesada.' };
    }

    const mBio = rawResult.rows[0];
    const { empresa_id, biometrico_sucursal_id, empleado_codigo, fecha_hora, estado: rawEstado } = mBio;

    // 2. Buscar al empleado correspondiente
    const empleadoResult = await client.query(
      `SELECT id, sucursal_habitual_id 
       FROM empleados 
       WHERE empresa_id = $1 AND codigo = $2 AND estado = 'activo'
       LIMIT 1`,
      [empresa_id, empleado_codigo]
    );

    if (empleadoResult.rows.length === 0) {
      throw new Error(`Empleado con código ${empleado_codigo} no encontrado o inactivo.`);
    }

    const empleado = empleadoResult.rows[0];

    // 3. Determinar la sucursal del registro
    // Prioridad 1: Sucursal configurada en el biométrico
    // Prioridad 2: Sucursal habitual del empleado
    const sucursalId = biometrico_sucursal_id || empleado.sucursal_habitual_id;

    if (!sucursalId) {
      throw new Error('No se pudo determinar la sucursal de la marcación (el biométrico no tiene sucursal y el empleado no tiene sucursal habitual).');
    }

    // Obtener datos de la sucursal (para geocerca y coordenadas)
    const sucursalResult = await client.query(
      `SELECT latitud, longitud FROM sucursales WHERE id = $1 LIMIT 1`,
      [sucursalId]
    );

    if (sucursalResult.rows.length === 0) {
      throw new Error(`La sucursal ID ${sucursalId} no existe.`);
    }

    const sucursal = sucursalResult.rows[0];

    // 4. Mapear estado del biométrico a 'entrada' o 'salida'
    // Protocolo ZKTeco típico: 0, 2, 4 = entrada/breakout/overtimein, 1, 3, 5 = salida/breakin/overtimeout
    // También aceptamos si viene directo como texto
    let tipo = 'entrada';
    const cleanEstado = String(rawEstado).trim().toLowerCase();
    
    if (cleanEstado === '1' || cleanEstado === '3' || cleanEstado === '5' || cleanEstado === 'salida') {
      tipo = 'salida';
    }

    // 5. Obtener horario asignado al empleado para esa fecha
    const horario = await findActiveHorario(empresa_id, empleado.id, fecha_hora);
    const horarioId = horario ? horario.id : null;

    // 6. Insertar en la tabla real de marcaciones
    // Nota: Como es un biométrico físico, latitud y longitud son las de la sucursal y la distancia es 0.
    const marcacionResult = await client.query(
      `INSERT INTO marcaciones (
        empresa_id,
        empleado_id,
        sucursal_id,
        horario_id,
        tipo,
        estado,
        latitud,
        longitud,
        distancia_metros,
        dentro_geocerca,
        motivo_novedad,
        detalle_novedad,
        marcado_en
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      [
        empresa_id,
        empleado.id,
        sucursalId,
        horarioId,
        tipo,
        'aceptada', // se acepta directo al ser un biométrico físico
        sucursal.latitud,
        sucursal.longitud,
        0.00, // distancia metros 0
        true, // dentro de geocerca
        'Biométrico',
        `Sincronizado desde biométrico serial: ${mBio.biometrico_serial}`,
        fecha_hora
      ]
    );

    const nuevaMarcacionId = marcacionResult.rows[0].id;

    // 7. Actualizar el registro biométrico para marcarlo como procesado y enlazarlo
    await client.query(
      `UPDATE marcaciones_biometricas 
       SET procesado = TRUE, marcacion_id = $1, error_procesamiento = NULL 
       WHERE id = $2`,
      [nuevaMarcacionId, biometricaId]
    );

    await client.query('COMMIT');
    return { ok: true, marcacionId: nuevaMarcacionId };

  } catch (error) {
    await client.query('ROLLBACK');

    // Registrar el error en la tabla de marcación biométrica para debug
    await pool.query(
      `UPDATE marcaciones_biometricas 
       SET procesado = FALSE, error_procesamiento = $1 
       WHERE id = $2`,
      [error.message, biometricaId]
    );

    return { ok: false, error: error.message };
  } finally {
    client.release();
  }
}

/**
 * Procesa en lote todas las marcaciones biométricas que aún no hayan sido procesadas
 */
async function procesarMarcacionesPendientes() {
  const result = await pool.query(
    `SELECT id FROM marcaciones_biometricas 
     WHERE procesado = FALSE 
     ORDER BY fecha_hora ASC`
  );

  let exitosos = 0;
  let fallidos = 0;
  const errores = [];

  for (const row of result.rows) {
    const res = await procesarMarcacionBiometrica(row.id);
    if (res.ok) {
      exitosos++;
    } else {
      fallidos++;
      errores.push({ id: row.id, error: res.error });
    }
  }

  return {
    total_leidos: result.rows.length,
    exitosos,
    fallidos,
    errores
  };
}

module.exports = {
  procesarMarcacionBiometrica,
  procesarMarcacionesPendientes
};
