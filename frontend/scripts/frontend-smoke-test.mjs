import { readFile } from 'node:fs/promises';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const apiUrl = process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:4000/api';
const email = process.env.TEST_EMAIL || 'iter27pos@gmail.com';
const password = process.env.TEST_PASSWORD || 'Admin123*';

const checks = [];

function ok(name, detail = '') {
  checks.push({ name, status: 'ok', detail });
}

function fail(name, detail) {
  checks.push({ name, status: 'fail', detail });
}

function assert(condition, name, detail = '') {
  if (condition) ok(name, detail);
  else fail(name, detail || 'Condition was false');
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { response, body };
}

async function expectStatus(name, url, expectedStatus, options = {}) {
  try {
    const { response } = await request(url, options);
    assert(response.status === expectedStatus, name, `Expected ${expectedStatus}, got ${response.status}`);
  } catch (error) {
    fail(name, error.message);
  }
}

async function expectOkApi(name, path, headers) {
  try {
    const { response, body } = await request(`${apiUrl}${path}`, { headers });
    assert(response.ok && body?.ok !== false, name, `Status ${response.status}`);
    return body?.data;
  } catch (error) {
    fail(name, error.message);
    return null;
  }
}

async function expectSource(name, file, patterns) {
  try {
    const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    const missing = patterns.filter((pattern) => !content.includes(pattern));
    assert(missing.length === 0, name, missing.length ? `Missing: ${missing.join(', ')}` : '');
  } catch (error) {
    fail(name, error.message);
  }
}

async function run() {
  await expectStatus('frontend login route', `${frontendUrl}/login`, 200);
  await expectStatus('frontend protected dashboard route', `${frontendUrl}/dashboard`, 200);
  await expectStatus('frontend sucursales route', `${frontendUrl}/sucursales`, 200);
  await expectStatus('frontend empleados route', `${frontendUrl}/empleados`, 200);
  await expectStatus('frontend marcaciones route', `${frontendUrl}/marcaciones`, 200);
  await expectStatus('frontend reportes route', `${frontendUrl}/reportes`, 200);
  await expectStatus('frontend facturacion route', `${frontendUrl}/facturacion`, 200);

  await expectStatus('protected api rejects anonymous access', `${apiUrl}/empresas`, 401);

  const login = await request(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const accessToken = login.body?.data?.tokens?.accessToken;
  assert(login.response.ok && Boolean(accessToken), 'login api with seeded user', `Status ${login.response.status}`);

  if (accessToken) {
    const authHeaders = { Authorization: `Bearer ${accessToken}` };
    const empresas = await expectOkApi('empresas api list', '/empresas?limit=20', authHeaders);
    const empresaId = login.body?.data?.user?.empresa_id || empresas?.items?.[0]?.id;
    const tenantHeaders = empresaId ? { ...authHeaders, 'x-empresa-id': empresaId } : authHeaders;

    await expectOkApi('sucursales api list', '/sucursales?limit=20', tenantHeaders);
    await expectOkApi('empleados api list', '/empleados?limit=20', tenantHeaders);
    await expectOkApi('marcaciones api list', '/marcaciones?limit=20', tenantHeaders);
    await expectOkApi('reportes api diaria', `/reportes/asistencia-diaria?fecha=${new Date().toISOString().slice(0, 10)}`, tenantHeaders);
    await expectOkApi('reportes api novedades', '/reportes/novedades?limit=20', tenantHeaders);
    await expectOkApi('facturacion api facturas', '/facturacion/facturas?limit=20', tenantHeaders);
    await expectOkApi('facturacion api pagos', '/facturacion/pagos?limit=20', tenantHeaders);
  }

  await expectSource('sucursales crud service', 'src/services/sucursalService.js', [
    'createSucursal',
    'updateSucursal',
    'deleteSucursal',
  ]);
  await expectSource('empleados crud service', 'src/services/empleadoService.js', [
    'createEmpleado',
    'updateEmpleado',
    'deleteEmpleado',
  ]);
  await expectSource('qr gps attendance flow', 'src/pages/marcaciones/MarcarAsistencia.jsx', [
    'Html5Qrcode',
    'validarPermisoGPS',
    'obtenerUbicacion',
    'Sucursal diferente',
    'motivo_novedad',
  ]);
  await expectSource('reports frontend flow', 'src/pages/reportes/Reportes.jsx', [
    'getAsistenciaDiaria',
    'getAsistenciaMensual',
    'getNovedades',
    'getAtrasos',
    'downloadCsv',
  ]);
  await expectSource('billing frontend flow', 'src/pages/facturacion/Facturas.jsx', [
    'Nueva factura',
    'Pagos',
    'anularFactura',
  ]);
  await expectSource('payments approval flow', 'src/pages/facturacion/Pagos.jsx', [
    'Registrar comprobante',
    'aprobarPago',
    'Anular pago',
  ]);

  const failed = checks.filter((check) => check.status === 'fail');

  for (const check of checks) {
    const prefix = check.status === 'ok' ? 'OK' : 'FAIL';
    console.log(`${prefix} ${check.name}${check.detail ? ` - ${check.detail}` : ''}`);
  }

  if (failed.length) {
    console.error(`Smoke test failed: ${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`Smoke test passed: ${checks.length} checks.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
