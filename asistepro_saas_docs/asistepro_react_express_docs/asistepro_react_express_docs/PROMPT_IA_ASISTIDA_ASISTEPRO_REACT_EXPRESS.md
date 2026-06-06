# PROMPT MAESTRO PARA IA ASISTIDA DE DESARROLLO

Actúa como un Arquitecto Senior de Software y Desarrollador Full Stack experto en SaaS Multi-Tenant.

Vas a crear un proyecto llamado AsistePro.

AsistePro es una plataforma SaaS Multi-Tenant para control de asistencia laboral mediante QR + GPS, sin biometría.

## Stack obligatorio

Frontend:
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Axios
- TanStack Query

Backend:
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- ExcelJS
- qrcode

Base de datos:
- PostgreSQL

Arquitectura:
- Separar frontend y backend.
- Backend modular.
- Clean Architecture simplificada.
- Repository Pattern.
- Service Layer.
- Middlewares.
- DTOs.
- Validaciones con Zod.
- API REST.

## Regla principal

No generes todo el sistema de una sola vez.

Trabaja por fases.

Antes de pasar a la siguiente fase, entrega:

1. Explicación clara.
2. Estructura de carpetas.
3. Código completo de esa fase.
4. Migraciones o modelos Prisma.
5. Endpoints creados.
6. Pruebas manuales.
7. Checklist de validación.

Luego espera mi aprobación.

---

# FASES DEL PROYECTO

## FASE 1 - Configuración inicial

Crear monorepo:

```txt
asistepro/
  frontend/
  backend/
  docs/
```

Frontend:

- Crear app React con Vite.
- Configurar TypeScript.
- Configurar Tailwind CSS.
- Configurar React Router.
- Crear layout base.
- Crear páginas iniciales.

Backend:

- Crear proyecto Node + Express + TypeScript.
- Configurar ts-node-dev.
- Configurar dotenv.
- Configurar CORS.
- Configurar Helmet.
- Crear endpoint health check.

---

## FASE 2 - Base de datos y Prisma

Configurar:

- PostgreSQL.
- Prisma.
- Conexión mediante DATABASE_URL.
- Migración inicial.

Crear modelos:

- Empresa.
- Usuario.
- Rol.
- Plan.
- Suscripcion.
- Factura.
- Pago.
- Sucursal.
- Horario.
- Marcacion.
- Auditoria.

Todas las tablas operativas deben tener empresa_id.

---

## FASE 3 - Planes, suscripciones y facturación

Crear seed inicial de planes:

- Gratis.
- Básico.
- Pyme.
- Empresarial.
- Corporativo.

Reglas:

- Toda empresa nueva inicia con plan Gratis.
- Una empresa debe tener suscripción activa.
- Si supera límite del plan, bloquear creación.
- Si está suspendida, solo permitir acceso a facturación.

Endpoints:

```txt
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
```

Middlewares:

- subscriptionGuard.
- planGuard.

---

## FASE 4 - Autenticación

Crear:

- Login.
- Logout.
- Refresh token.
- Password hash con bcrypt.
- JWT access token.
- Refresh token.

Endpoints:

```txt
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/me
```

Middlewares:

- authGuard.
- roleGuard.
- tenantGuard.

---

## FASE 5 - Empresas

Solo Super Admin puede gestionar empresas.

Endpoints:

```txt
GET /api/empresas
POST /api/empresas
GET /api/empresas/:id
PUT /api/empresas/:id
PUT /api/empresas/:id/suspender
PUT /api/empresas/:id/activar
```

Al crear empresa:

- Crear empresa.
- Crear usuario administrador.
- Asignar plan Gratis.
- Crear suscripción activa.

---

## FASE 6 - Sucursales

Endpoints:

```txt
GET /api/sucursales
POST /api/sucursales
GET /api/sucursales/:id
PUT /api/sucursales/:id
DELETE /api/sucursales/:id
GET /api/sucursales/:id/qr
```

Reglas:

- Validar límite de sucursales según plan.
- Generar qr_token único.
- Crear QR fijo por sucursal.

---

## FASE 7 - Empleados

Endpoints:

```txt
GET /api/empleados
POST /api/empleados
GET /api/empleados/:id
PUT /api/empleados/:id
DELETE /api/empleados/:id
```

Reglas:

- Validar límite de empleados según plan.
- Cada empleado pertenece a una empresa.
- Cada empleado tiene sucursal habitual.

---

## FASE 8 - Horarios

Endpoints:

```txt
GET /api/horarios
POST /api/horarios
GET /api/horarios/:id
PUT /api/horarios/:id
DELETE /api/horarios/:id
```

Campos:

- nombre.
- hora_entrada.
- hora_salida.
- tolerancia_minutos.

---

## FASE 9 - Marcaciones QR + GPS

Flujo:

1. Empleado inicia sesión.
2. Escanea QR.
3. El navegador obtiene GPS.
4. Backend valida QR.
5. Backend valida sucursal.
6. Backend valida distancia GPS.
7. Backend registra marcación.

Reglas:

- El empleado puede marcar en cualquier sucursal activa de su empresa.
- Si marca en sucursal habitual, estado aceptada.
- Si marca en otra sucursal, estado aceptada_con_novedad.
- Si marca en otra sucursal, debe enviar motivo_novedad.
- Si está fuera del radio GPS, rechazar.
- Evitar doble marcación inmediata.

Motivos válidos:

- reemplazo.
- apoyo_temporal.
- emergencia.
- autorizado_supervisor.
- otro.

Endpoints:

```txt
POST /api/marcaciones
GET /api/marcaciones
GET /api/marcaciones/mis-marcaciones
```

---

## FASE 10 - Reportes y Excel

Endpoints:

```txt
GET /api/reportes/asistencia-diaria
GET /api/reportes/asistencia-mensual
GET /api/reportes/atrasos
GET /api/reportes/novedades
GET /api/reportes/exportar-excel
```

Usar ExcelJS.

---

## FASE 11 - Frontend Paneles

Crear interfaces:

Panel Super Admin:

- Dashboard global.
- Empresas.
- Planes.
- Suscripciones.
- Facturas.
- Pagos.

Panel Admin Empresa:

- Dashboard empresa.
- Sucursales.
- Empleados.
- Horarios.
- Reportes.

Panel RRHH:

- Marcaciones.
- Novedades.
- Reportes.

Panel Empleado:

- Marcar asistencia.
- Escanear QR.
- Historial.

---

## FASE 12 - Seguridad y producción

Implementar:

- Rate limiting.
- Helmet.
- CORS seguro.
- Logs.
- Backups.
- Validación de variables de entorno.
- Build de producción.
- Deploy frontend.
- Deploy backend.
- Deploy base de datos.

---

# Instrucciones finales

Siempre prioriza:

- Código limpio.
- Separación por módulos.
- Seguridad multi-tenant.
- Validaciones.
- Simplicidad para MVP.
- Escalabilidad futura.

No uses Next.js.
No uses Firebase.
No uses MongoDB.
No uses biometría.
