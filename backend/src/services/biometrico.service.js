const { pool } = require('../config/database');

/**
 * Listar todos los dispositivos biométricos de una empresa, incluyendo el nombre de su sucursal
 */
async function listBiometricos(empresaId) {
  const result = await pool.query(
    `SELECT b.*, s.nombre AS sucursal_nombre
     FROM biometricos b
     LEFT JOIN sucursales s ON s.id = b.sucursal_id
     WHERE b.empresa_id = $1
     ORDER BY b.fecha_creacion DESC`,
    [empresaId]
  );
  return result.rows;
}

/**
 * Obtener un biométrico por ID y validar pertenencia a la empresa
 */
async function findBiometricoById(empresaId, id) {
  const result = await pool.query(
    `SELECT b.*, s.nombre AS sucursal_nombre
     FROM biometricos b
     LEFT JOIN sucursales s ON s.id = b.sucursal_id
     WHERE b.empresa_id = $1 AND b.id = $2
     LIMIT 1`,
    [empresaId, id]
  );
  return result.rows[0] || null;
}

/**
 * Actualizar los datos de un biométrico (nombre, sucursal_id, modelo, estado)
 */
async function updateBiometrico(empresaId, id, data) {
  const { nombre, sucursal_id, modelo, estado } = data;
  
  // Validar si la sucursal pertenece a la empresa si es provista
  if (sucursal_id) {
    const sucCheck = await pool.query(
      'SELECT id FROM sucursales WHERE empresa_id = $1 AND id = $2 LIMIT 1',
      [empresaId, sucursal_id]
    );
    if (sucCheck.rows.length === 0) {
      const error = new Error('La sucursal provista no pertenece a la empresa.');
      error.statusCode = 400;
      throw error;
    }
  }

  const result = await pool.query(
    `UPDATE biometricos
     SET nombre = COALESCE($1, nombre),
         sucursal_id = COALESCE($2, sucursal_id),
         modelo = COALESCE($3, modelo),
         estado = COALESCE($4, estado),
         actualizado_en = NOW()
     WHERE empresa_id = $5 AND id = $6
     RETURNING *`,
    [nombre, sucursal_id || null, modelo, estado, empresaId, id]
  );

  return result.rows[0] || null;
}

/**
 * Eliminar un dispositivo biométrico de la empresa
 */
async function deleteBiometrico(empresaId, id) {
  const result = await pool.query(
    'DELETE FROM biometricos WHERE empresa_id = $1 AND id = $2 RETURNING id',
    [empresaId, id]
  );
  return result.rows.length > 0;
}

/**
 * Obtener un resumen de asistencia biométrica (últimas marcaciones procesadas, errores y estado de dispositivos)
 */
async function getAsistenciaBiometricaResumen(empresaId) {
  // Dispositivos activos / totales
  const devicesResult = await pool.query(
    `SELECT 
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE estado = 'online')::int AS online,
       COUNT(*) FILTER (WHERE estado = 'offline')::int AS offline
     FROM biometricos 
     WHERE empresa_id = $1`,
    [empresaId]
  );

  // Conteo de marcaciones procesadas vs con error en las últimas 24 horas
  const statsResult = await pool.query(
    `SELECT 
       COUNT(*)::int AS total_recibido,
       COUNT(*) FILTER (WHERE procesado = TRUE)::int AS procesadas,
       COUNT(*) FILTER (WHERE procesado = FALSE AND error_procesamiento IS NOT NULL)::int AS con_error,
       COUNT(*) FILTER (WHERE procesado = FALSE AND error_procesamiento IS NULL)::int AS pendientes
     FROM marcaciones_biometricas mb
     INNER JOIN biometricos b ON b.serial = mb.biometrico_serial
     WHERE b.empresa_id = $1 AND mb.fecha_registro >= NOW() - INTERVAL '24 hours'`,
    [empresaId]
  );

  return {
    dispositivos: devicesResult.rows[0] || { total: 0, online: 0, offline: 0 },
    stats_24h: statsResult.rows[0] || { total_recibido: 0, procesadas: 0, con_error: 0, pendientes: 0 }
  };
}

module.exports = {
  listBiometricos,
  findBiometricoById,
  updateBiometrico,
  deleteBiometrico,
  getAsistenciaBiometricaResumen
};
