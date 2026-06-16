# ASISTEPRO SaaS Multi-Tenant V1.0

## 1. Descripción General

**AsistePro** es una plataforma SaaS Multi-Tenant para control de asistencia laboral mediante **QR + GPS**, diseñada para empresas que desean evitar el uso de biometría y mantener trazabilidad operativa.

El sistema permite que múltiples empresas usen una misma plataforma, manteniendo sus datos separados mediante `empresa_id` en todas las entidades principales.

---

## 2. Objetivo del Sistema

Crear una solución web/PWA que permita:

- Registrar asistencia mediante QR fijo por sucursal.
- Validar ubicación GPS del empleado.
- Gestionar empresas, empleados, sucursales y horarios.
- Manejar marcaciones en sucursal habitual y sucursal diferente.
- Registrar novedades cuando el empleado marca en una sucursal distinta.
- Generar reportes diarios y mensuales.
- Exportar reportes a Excel.
- Gestionar planes, suscripciones, facturas y pagos manuales.
- Funcionar como SaaS multi-tenant desde la versión inicial.

---

## 3. Tecnologías Recomendadas

### Frontend

- Next.js 16
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- PWA

### Backend

- Node.js
- Express
- TypeScript
- JWT
- Bcrypt
- Zod

### Base de Datos

- PostgreSQL
- Supabase PostgreSQL recomendado para producción inicial

### Hosting

- Frontend: Vercel
- Backend: Render
- Base de datos: Supabase

### Librerías útiles

- `qrcode`
- `html5-qrcode`
- `exceljs`
- `bcrypt`
- `jsonwebtoken`
- `zod`
- `cors`
- `helmet`
- `express-rate-limit`

---

## 4. Modelo SaaS Multi-Tenant

Cada empresa es un tenant independiente.

Regla principal:

```text
Toda tabla operativa debe tener empresa_id.
```

Ejemplo:

- Empresa A solo ve sus empleados, sucursales, horarios, marcaciones y facturas.
- Empresa B no puede acceder a información de Empresa A.

El backend debe incluir un middleware llamado `tenantGuard` que valide que el usuario solo pueda acceder a registros de su empresa.

---

## 5. Roles del Sistema

### Super Admin

Usuario dueño de la plataforma AsistePro.

Puede:

- Crear empresas.
- Suspender empresas.
- Gestionar planes.
- Gestionar suscripciones.
- Validar pagos.
- Ver métricas globales.

### Administrador Empresa

Usuario administrador de cada empresa cliente.

Puede:

- Crear empleados.
- Crear sucursales.
- Crear horarios.
- Ver reportes.
- Exportar Excel.

### RRHH

Puede:

- Revisar marcaciones.
- Corregir novedades.
- Aprobar o rechazar marcaciones excepcionales.
- Exportar reportes.

### Empleado

Puede:

- Iniciar sesión.
- Escanear QR.
- Marcar entrada y salida.
- Ver historial personal.

---

## 6. Módulos V1

### 6.1 Autenticación

Funcionalidades:

- Login.
- Logout.
- Recuperar contraseña.
- Cambio de contraseña.
- JWT.
- Refresh Token.

---

### 6.2 Empresas

Campos:

- Nombre.
- RUC.
- Dirección.
- Teléfono.
- Estado.
- Plan actual.

---

### 6.3 Planes

Planes iniciales:

| Plan | Empleados | Sucursales | Precio mensual |
|---|---:|---:|---:|
| Gratis | 5 | 1 | $0 |
| Básico | 25 | 2 | $9.99 |
| Pyme | 75 | 5 | $19.99 |
| Empresarial | 200 | 10 | $39.99 |
| Corporativo | Personalizado | Personalizado | Cotización |

---

### 6.4 Suscripciones

Reglas:

- Toda empresa debe tener una suscripción.
- Al crear una empresa se asigna automáticamente el plan Gratis.
- Si la suscripción está suspendida, la empresa solo puede acceder al módulo de facturación.
- El Super Admin puede cambiar manualmente el plan.

Estados:

```text
activa
vencida
suspendida
cancelada
prueba
```

---

### 6.5 Facturación y Pagos

Para V1 se manejarán pagos manuales.

Métodos iniciales:

- Transferencia bancaria.
- Validación manual por Super Admin.

Estados de factura:

```text
pendiente
pagada
vencida
anulada
```

Estados de pago:

```text
pendiente
aprobado
rechazado
reversado
```

---

### 6.6 Sucursales

Campos:

- Nombre.
- Dirección.
- Latitud.
- Longitud.
- Radio permitido en metros.
- QR Token.
- Estado.

El QR puede ser fijo en la versión inicial.

Ejemplo:

```text
https://asistepro.com/marcar/sucursal/abc123
```

---

### 6.7 Empleados

Campos:

- Nombres.
- Apellidos.
- Cédula.
- Correo.
- Teléfono.
- Cargo.
- Sucursal habitual.
- Horario asignado.
- Estado.

---

### 6.8 Horarios

Campos:

- Nombre.
- Hora entrada.
- Hora salida.
- Tolerancia en minutos.
- Días laborales.

---

### 6.9 Marcaciones

Tipos V1:

- Entrada.
- Salida.

Datos guardados:

- Usuario.
- Empresa.
- Sucursal.
- Fecha y hora.
- Latitud.
- Longitud.
- Distancia calculada.
- IP.
- Dispositivo.
- Estado.
- Observación.

---

## 7. Regla Operativa de Marcación

Un empleado puede marcar en cualquier sucursal activa de su empresa, siempre que esté físicamente dentro del radio GPS permitido.

Si marca en su sucursal habitual:

```text
Estado: aceptada
```

Si marca en una sucursal distinta:

```text
Estado: aceptada_con_novedad
```

El sistema debe solicitar motivo:

- Reemplazo.
- Apoyo temporal.
- Emergencia.
- Autorización de supervisor.
- Otro.

Esto permite cubrir casos reales donde un empleado trabaja un día en otra sucursal por reemplazo, emergencia o apoyo temporal.

---

## 8. Medidas Anti-Suplantación

Problema considerado:

```text
Empleado A conoce la contraseña de Empleado B y quiere marcar por él.
```

Medidas V1 recomendadas:

- GPS obligatorio.
- Registro de dispositivo.
- Alertas si un dispositivo marca por varios usuarios.
- Historial de IP.
- Historial de navegador.
- Bloqueo de marcaciones duplicadas.
- PIN de marcación opcional.
- Foto de evidencia opcional para futuras versiones.

Regla recomendada:

```text
Si el mismo dispositivo registra marcaciones de varios empleados en corto tiempo, crear alerta para RRHH.
```

---

## 9. Seguridad Mínima

- HTTPS obligatorio.
- Password Hash con bcrypt.
- JWT y Refresh Tokens.
- Middleware `tenantGuard`.
- Middleware `roleGuard`.
- Middleware `subscriptionGuard`.
- Middleware `planGuard`.
- Validación de datos con Zod.
- CORS configurado.
- Helmet.
- Rate limiting.
- Logs de auditoría.
- Backups de base de datos.
- Política de privacidad.
- Aviso de tratamiento de datos personales.

---

## 10. Reportes V1

Reportes:

- Asistencia diaria.
- Asistencia mensual.
- Atrasos.
- Faltas.
- Marcaciones por empleado.
- Marcaciones por sucursal.
- Marcaciones fuera de sucursal habitual.
- Novedades.

Filtros:

- Empresa.
- Sucursal.
- Empleado.
- Fecha inicio.
- Fecha fin.

Exportación:

- Excel.

---

## 11. Roadmap

### V1.0

- SaaS multi-tenant.
- Login.
- Empresas.
- Planes.
- Suscripciones.
- Facturación manual.
- Sucursales.
- Empleados.
- Horarios.
- QR fijo.
- GPS.
- Marcación entrada/salida.
- Reportes.
- Exportación Excel.

### V1.1

- Inicio y fin de almuerzo.

### V1.2

- QR dinámico.

### V1.3

- Solicitud de permisos.

### V1.4

- Vacaciones.

### V1.5

- Nómina.

### V2.0

- App móvil Flutter.

---

## 12. Diferenciador Comercial

Mensaje principal:

```text
AsistePro permite controlar la asistencia laboral sin biometría, usando QR + GPS, trazabilidad completa y una estructura SaaS lista para empresas con varias sucursales.
```

Ventaja frente a biométricos:

- No requiere equipos físicos costosos.
- No almacena huellas.
- Funciona desde celular.
- Permite múltiples sucursales.
- Genera reportes web.
- Se adapta a reemplazos y emergencias.

