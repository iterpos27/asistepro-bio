# Prompt Maestro para IA Asistida de Desarrollo

Actúa como un **Arquitecto Senior de Software SaaS** y desarrollador full stack experto.

Vas a construir un proyecto llamado **AsistePro**.

AsistePro es un SaaS Multi-Tenant para control de asistencia laboral mediante QR + GPS, sin uso de biometría.

## Instrucción Principal

No generes todo el sistema de una sola vez.

Debes desarrollar el proyecto **por fases, capas y módulos**.

Antes de avanzar a la siguiente fase, debes mostrar:

1. Explicación técnica.
2. Estructura de carpetas.
3. Código completo.
4. Migraciones SQL.
5. Endpoints creados.
6. Pruebas básicas.
7. Checklist de validación.

Después de cada fase debes detenerte y pedir aprobación para continuar.

---

# Stack Tecnológico

## Frontend

- Next.js 16
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- PWA

## Backend

- Node.js
- Express
- TypeScript
- Clean Architecture
- SOLID
- Repository Pattern
- Service Layer
- DTOs
- Zod
- JWT
- Bcrypt

## Base de Datos

- PostgreSQL

## Hosting objetivo

- Frontend: Vercel
- Backend: Render
- Base de datos: Supabase PostgreSQL

---

# Arquitectura Obligatoria

Usar arquitectura limpia:

```text
src/
  config/
  database/
  modules/
    auth/
    empresas/
    planes/
    suscripciones/
    facturas/
    pagos/
    sucursales/
    empleados/
    horarios/
    marcaciones/
    reportes/
  middlewares/
  shared/
  utils/
```

Cada módulo debe tener:

```text
controller
service
repository
dto
routes
validation
```

---

# Reglas Multi-Tenant

El sistema debe ser multi-tenant desde el inicio.

Reglas:

- Cada empresa es un tenant.
- Toda tabla operativa debe incluir `empresa_id`.
- Ningún usuario puede acceder a datos de otra empresa.
- Crear middleware `tenantGuard`.
- Crear middleware `roleGuard`.
- Crear middleware `subscriptionGuard`.
- Crear middleware `planGuard`.

---

# Roles

Crear los siguientes roles:

```text
SUPER_ADMIN
ADMIN_EMPRESA
RRHH
EMPLEADO
```

---

# Fases de Desarrollo

## FASE 1 - Inicialización del Proyecto

Crear:

- Monorepo o estructura separada frontend/backend.
- Backend Express + TypeScript.
- Frontend Next.js + TypeScript.
- Variables de entorno.
- ESLint.
- Prettier.
- Docker Compose para PostgreSQL.
- README inicial.

Entregar:

- Estructura de carpetas.
- Configuración completa.
- Comandos para ejecutar.

---

## FASE 2 - Base de Datos Inicial

Crear migraciones para:

- empresas
- usuarios
- roles
- usuarios_roles si aplica

Debe incluir:

- UUID como primary key.
- timestamps.
- estado activo/inactivo.
- empresa_id donde corresponda.

---

## FASE 2.5 - Planes, Suscripciones y Facturación

Crear tablas:

- planes
- suscripciones
- facturas
- pagos

Crear seed inicial de planes:

```text
Gratis: 5 empleados, 1 sucursal, $0
Básico: 25 empleados, 2 sucursales, $9.99
Pyme: 75 empleados, 5 sucursales, $19.99
Empresarial: 200 empleados, 10 sucursales, $39.99
Corporativo: límites personalizados, cotización
```

Reglas:

- Al crear una empresa, asignar plan Gratis automáticamente.
- Una empresa sin suscripción activa no puede usar el sistema.
- Una empresa suspendida solo puede acceder al módulo de facturación.
- El plan define límites de empleados y sucursales.
- Bloquear creación de empleados si supera el límite del plan.
- Bloquear creación de sucursales si supera el límite del plan.
- Los pagos de V1 serán manuales mediante transferencia bancaria.
- El Super Admin valida el pago.
- Cuando una factura se paga, la suscripción se activa o renueva.

Endpoints:

```text
GET /api/planes
POST /api/planes
PUT /api/planes/:id

GET /api/suscripciones
POST /api/suscripciones
PUT /api/suscripciones/:id

GET /api/facturas
POST /api/facturas
PUT /api/facturas/:id

POST /api/pagos
PUT /api/pagos/:id/aprobar
PUT /api/pagos/:id/rechazar
```

Middlewares:

```text
subscriptionGuard
planGuard
```

---

## FASE 3 - Autenticación

Crear:

- Login.
- Logout.
- Refresh Token.
- Hash de contraseña con bcrypt.
- JWT con rol y empresa_id.
- Middleware authGuard.

Endpoints:

```text
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
GET /api/auth/me
```

---

## FASE 4 - Gestión de Empresas

Crear CRUD de empresas.

Solo SUPER_ADMIN puede crear, editar o suspender empresas.

Al crear una empresa:

- Crear empresa.
- Crear suscripción gratis.
- Crear usuario administrador inicial.

Endpoints:

```text
GET /api/empresas
POST /api/empresas
GET /api/empresas/:id
PUT /api/empresas/:id
PATCH /api/empresas/:id/suspender
```

---

## FASE 5 - Gestión de Sucursales

Crear CRUD de sucursales.

Campos:

- empresa_id
- nombre
- direccion
- latitud
- longitud
- radio_metros
- qr_token
- estado

Reglas:

- Validar límite del plan con `planGuard`.
- Generar `qr_token` único.
- Crear endpoint para obtener QR.

Endpoints:

```text
GET /api/sucursales
POST /api/sucursales
GET /api/sucursales/:id
PUT /api/sucursales/:id
GET /api/sucursales/:id/qr
```

---

## FASE 6 - Gestión de Empleados

Crear CRUD de empleados.

Campos:

- empresa_id
- nombres
- apellidos
- cedula
- correo
- telefono
- cargo
- sucursal_habitual_id
- horario_id
- estado

Reglas:

- Validar límite de empleados del plan.
- Un empleado pertenece a una sola empresa.
- Un empleado puede tener una sucursal habitual.

Endpoints:

```text
GET /api/empleados
POST /api/empleados
GET /api/empleados/:id
PUT /api/empleados/:id
PATCH /api/empleados/:id/desactivar
```

---

## FASE 7 - Gestión de Horarios

Crear CRUD de horarios.

Campos:

- empresa_id
- nombre
- hora_entrada
- hora_salida
- tolerancia_minutos
- dias_laborales

Endpoints:

```text
GET /api/horarios
POST /api/horarios
GET /api/horarios/:id
PUT /api/horarios/:id
DELETE /api/horarios/:id
```

---

## FASE 8 - Generación y Lectura QR

Crear:

- Generación QR por sucursal.
- Página pública protegida para escanear QR.
- Token QR fijo por sucursal para V1.

El QR debe apuntar a:

```text
https://dominio.com/marcar/sucursal/:qr_token
```

---

## FASE 9 - Marcaciones QR + GPS

Crear módulo de marcaciones.

Tipos V1:

```text
ENTRADA
SALIDA
```

Flujo:

1. Empleado inicia sesión.
2. Escanea QR.
3. Frontend obtiene GPS.
4. Backend valida QR.
5. Backend valida que la sucursal pertenezca a la empresa del empleado.
6. Backend calcula distancia GPS.
7. Si está dentro del radio permitido, registra marcación.
8. Si la sucursal es diferente a su sucursal habitual, registra novedad.

Estados:

```text
aceptada
aceptada_con_novedad
rechazada
pendiente
```

Motivos de novedad:

```text
Reemplazo
Apoyo temporal
Emergencia
Autorización supervisor
Otro
```

Endpoints:

```text
POST /api/marcaciones
GET /api/marcaciones
GET /api/marcaciones/mis-marcaciones
GET /api/marcaciones/novedades
PATCH /api/marcaciones/:id/aprobar
PATCH /api/marcaciones/:id/rechazar
```

Reglas anti-suplantación:

- Guardar IP.
- Guardar dispositivo.
- Guardar user-agent.
- Alertar si un dispositivo marca por varios usuarios.
- Bloquear doble marcación en corto tiempo.

---

## FASE 10 - Reportes y Exportación Excel

Crear reportes:

- Asistencia diaria.
- Asistencia mensual.
- Atrasos.
- Faltas.
- Novedades.
- Marcaciones por sucursal.
- Marcaciones por empleado.

Exportación:

- Excel con ExcelJS.

Endpoints:

```text
GET /api/reportes/asistencia-diaria
GET /api/reportes/asistencia-mensual
GET /api/reportes/atrasos
GET /api/reportes/novedades
GET /api/reportes/exportar-excel
```

---

## FASE 11 - Dashboard

Crear dashboards por rol.

SUPER_ADMIN:

- Empresas activas.
- Empresas suspendidas.
- Suscripciones activas.
- Facturas pendientes.
- Pagos pendientes.

ADMIN_EMPRESA / RRHH:

- Empleados activos.
- Sucursales.
- Marcaciones de hoy.
- Atrasos de hoy.
- Novedades pendientes.

EMPLEADO:

- Última marcación.
- Historial personal.
- Botón marcar asistencia.

---

# Reglas Finales de Desarrollo

- No mezclar datos entre empresas.
- No crear endpoints sin validación de rol.
- No guardar contraseñas en texto plano.
- No usar biometría.
- No avanzar de fase sin aprobación.
- Priorizar código limpio y mantenible.
- Agregar comentarios donde la lógica sea importante.

