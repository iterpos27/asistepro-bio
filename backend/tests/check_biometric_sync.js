const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'asistepro_bio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
});

async function checkStatus() {
  try {
    console.log('--- ESTADO DE LA INTEGRACIÓN DE BIOMÉTRICOS ---');

    // 1. Verificar Dispositivos
    const devices = await pool.query('SELECT * FROM biometricos');
    console.log(`\n1. Dispositivos Detectados: ${devices.rows.length}`);
    devices.rows.forEach(d => {
      console.log(`   - Nombre: "${d.nombre}" | Serial: ${d.serial} | Estado: ${d.estado} | Último Sync: ${d.ultimo_sync || 'Nunca'}`);
    });

    // 2. Verificar Logs de Conexión Recientes
    const logs = await pool.query('SELECT * FROM zkteco_logs ORDER BY fecha DESC LIMIT 5');
    console.log(`\n2. Últimos 5 Eventos/Logs de ZKTeco:`);
    if (logs.rows.length === 0) {
      console.log('   (Ninguno)');
    } else {
      logs.rows.forEach(l => {
        console.log(`   - [${l.fecha.toISOString()}] Serial: ${l.biometrico_serial} | Tipo: ${l.tipo} | Contenido: ${l.contenido}`);
      });
    }

    // 3. Verificar Marcaciones Biométricas Crudas
    const mBio = await pool.query('SELECT * FROM marcaciones_biometricas ORDER BY fecha_hora DESC LIMIT 5');
    console.log(`\n3. Últimas 5 Marcaciones Crudas (marcaciones_biometricas):`);
    if (mBio.rows.length === 0) {
      console.log('   (Ninguna)');
    } else {
      mBio.rows.forEach(m => {
        console.log(`   - PIN: ${m.empleado_codigo} | Hora: ${m.fecha_hora.toISOString()} | Procesado: ${m.procesado} | Error: ${m.error_procesamiento || 'Ninguno'}`);
      });
    }

    // 4. Verificar Marcaciones Procesadas Reales
    const marcaciones = await pool.query(
      `SELECT m.id, e.nombres, e.apellidos, s.nombre AS sucursal, m.tipo, m.marcado_en
       FROM marcaciones m
       INNER JOIN empleados e ON e.id = m.empleado_id
       INNER JOIN sucursales s ON s.id = m.sucursal_id
       WHERE m.detalle_novedad LIKE '%Sincronizado desde biométrico%'
       ORDER BY m.marcado_en DESC LIMIT 5`
    );
    console.log(`\n4. Últimas 5 Marcaciones Procesadas en la Tabla Real (marcaciones):`);
    if (marcaciones.rows.length === 0) {
      console.log('   (Ninguna)');
    } else {
      marcaciones.rows.forEach(m => {
        console.log(`   - Empleado: ${m.nombres} ${m.apellidos} | Sucursal: ${m.sucursal} | Tipo: ${m.tipo} | Marcado: ${m.marcado_en.toISOString()}`);
      });
    }

  } catch (error) {
    console.error('Error al conectarse o consultar la base de datos:', error.message);
  } finally {
    await pool.end();
  }
}

checkStatus();
