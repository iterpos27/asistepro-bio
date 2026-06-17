const assert = require('node:assert/strict');
const test = require('node:test');

const { pool } = require('../src/config/database');
const zktecoService = require('../src/services/zktecoService');
const biometricoAsistenciaService = require('../src/services/biometricoAsistenciaService');

const originalQuery = pool.query;

test.afterEach(() => {
  pool.query = originalQuery;
});

test('processAttlog parsea lineas de ATTLOG correctamente', async () => {
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    if (/SELECT \* FROM biometricos/.test(sql)) {
      return { rows: [{ id: 'device-uuid-1', serial: 'SN12345', empresa_id: 'empresa-uuid' }] };
    }
    if (/INSERT INTO marcaciones_biometricas/.test(sql)) {
      return { rows: [{ id: 'm-bio-uuid-1' }] };
    }
    if (/INSERT INTO zkteco_logs/.test(sql)) {
      return { rows: [] };
    }
    return { rows: [] };
  };

  const attlog = '1001\t2026-06-17 12:30:15\t0\t1\t0\t0\t0\r\n1002\t2026-06-17 12:35:20\t1\t1\t0\t0\t0\r\n';
  const result = await zktecoService.processAttlog('SN12345', attlog);

  assert.equal(result.procesadas, 2);
  assert.equal(result.duplicadas, 0);
  assert.equal(result.errores_cantidad, 0);

  // Check SQL values for the first insertion
  const insertQuery = queries.find(q => /INSERT INTO marcaciones_biometricas/.test(q.sql));
  assert.ok(insertQuery);
  assert.equal(insertQuery.values[0], 'SN12345'); // serial
  assert.equal(insertQuery.values[1], '1001'); // PIN / empleado_codigo
  assert.equal(insertQuery.values[2], '2026-06-17 12:30:15'); // fecha_hora
  assert.equal(insertQuery.values[3], '0'); // status (entrada)
});

test('procesarMarcacionBiometrica enlaza marcaciones_biometricas con marcaciones de AsistePro', async () => {
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    // mock raw log retrieval
    if (/SELECT\s+mb\.\*,\s+b\.empresa_id/i.test(sql)) {
      return {
        rows: [{
          id: 'mbio-id',
          biometrico_serial: 'SN12345',
          empleado_codigo: '1001',
          fecha_hora: new Date('2026-06-17T12:30:15Z'),
          estado: '0',
          verificacion: '1',
          empresa_id: 'empresa-uuid',
          biometrico_sucursal_id: 'sucursal-uuid'
        }]
      };
    }
    // mock employee retrieval
    if (/SELECT\s+id,\s+sucursal_habitual_id\s+FROM\s+empleados/i.test(sql)) {
      return { rows: [{ id: 'empleado-uuid', sucursal_habitual_id: 'sucursal-uuid' }] };
    }
    // mock sucursal retrieval
    if (/SELECT\s+latitud,\s+longitud\s+FROM\s+sucursales/i.test(sql)) {
      return { rows: [{ latitud: '-0.180653', longitud: '-78.467834' }] };
    }
    // mock active shift/horario
    if (/SELECT\s+h\.\*\s+FROM\s+empleado_horarios/i.test(sql)) {
      return { rows: [{ id: 'horario-uuid' }] };
    }
    // mock marcaciones insertion
    if (/INSERT\s+INTO\s+marcaciones/i.test(sql)) {
      return { rows: [{ id: 'new-marcacion-uuid' }] };
    }
    // mock marcaciones_biometricas update
    if (/UPDATE\s+marcaciones_biometricas/i.test(sql)) {
      return { rows: [] };
    }
    return { rows: [] };
  };

  // Mock transaction control since we call client.query in service
  pool.connect = async () => {
    return {
      query: pool.query,
      release: () => {}
    };
  };

  const result = await biometricoAsistenciaService.procesarMarcacionBiometrica('mbio-id');
  if (!result.ok) {
    console.error('Error in test procesarMarcacionBiometrica:', result.error);
  }
  assert.equal(result.ok, true);
  assert.equal(result.marcacionId, 'new-marcacion-uuid');

  const insertQuery = queries.find(q => /INSERT\s+INTO\s+marcaciones/i.test(q.sql));
  assert.ok(insertQuery);
  assert.equal(insertQuery.values[0], 'empresa-uuid');
  assert.equal(insertQuery.values[1], 'empleado-uuid');
  assert.equal(insertQuery.values[2], 'sucursal-uuid');
  assert.equal(insertQuery.values[4], 'entrada'); // mapped from status '0'
  assert.equal(insertQuery.values[6], '-0.180653'); // sucursal latitud
});
