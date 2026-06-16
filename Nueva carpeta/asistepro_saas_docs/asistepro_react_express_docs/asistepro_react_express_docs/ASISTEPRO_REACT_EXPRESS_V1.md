# ASISTEPRO SaaS Multi-Tenant V1.0

## Stack Reformulado

AsistePro será desarrollado con:

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- ORM recomendado: Prisma
- Autenticación: JWT + Refresh Token
- Estilos: Tailwind CSS
- Exportación Excel: ExcelJS
- QR: qrcode + html5-qrcode
- Validaciones: Zod
- Hosting recomendado:
  - Frontend: Vercel o Netlify
  - Backend: Render o Railway
  - Base de datos: Supabase PostgreSQL, Neon o Railway PostgreSQL

---

# Objetivo del Proyecto

Crear una plataforma SaaS Multi-Tenant para control de asistencia laboral mediante QR + GPS, evitando el uso de datos biométricos.

El sistema debe permitir que varias empresas usen la misma plataforma, manteniendo sus datos aislados por empresa.

---

# Concepto Comercial

Nombre: AsistePro

Slogan sugerido:

> Control inteligente de asistencia laboral sin biometría.

Diferenciador:

> Asistencia mediante QR + GPS, con trazabilidad, auditoría y enfoque en protección de datos personales.

---

# Arquitectura General

## Estructura del Monorepo

```txt
asistepro/
  frontend/
    src/
      components/
      pages/
      routes/
      services/
      hooks/
      contexts/
      layouts/
      utils/
  backend/
    src/
      config/
      modules/
      middlewares/
      routes/
      utils/
      prisma/
  docs/
  README.md
```

---

# Modelo Multi-Tenant

Cada empresa será un tenant.

Todas las tablas operativas deben tener `empresa_id`.

Regla principal:

```txt
Un usuario solo puede ver, crear, modificar o eliminar datos de su propia empresa.
```

Middlewares necesarios:

- authGuard
- roleGuard
- tenantGuard
- subscriptionGuard
- planGuard

---

# Roles

## Super Admin

Usuario dueño de la plataforma SaaS.

Puede:

- Crear empresas.
- Ver todas las empresas.
- Activar o suspender empresas.
- Gestionar planes.
- Gestionar suscripciones.
- Validar pagos.
- Ver métricas globales.

## Admin Empresa

Puede:

- Gestionar sucursales.
- Gestionar empleados.
- Gestionar horarios.
- Ver reportes.
- Exportar Excel.

## RRHH

Puede:

- Revisar asistencia.
- Corregir marcaciones.
- Revisar novedades.
- Exportar reportes.

## Empleado

Puede:

- Marcar entrada.
- Marcar salida.
- Ver historial personal.

---

# Módulos V1

## 1. Autenticación

Funciones:

- Login.
- Logout.
- Refresh token.
- Recuperación de contraseña.
- Cambio de contraseña.

---

## 2. Empresas

Campos:

- nombre
- ruc
- telefono
- direccion
- estado

Estados:

- activa
- suspendida
- cancelada

---

## 3. Planes SaaS

Planes iniciales:

| Plan | Empleados | Sucursales | Precio mensual |
|---|---:|---:|---:|
| Gratis | 5 | 1 | 0.00 |
| Básico | 25 | 2 | 9.99 |
| Pyme | 75 | 5 | 19.99 |
| Empresarial | 200 | 10 | 39.99 |
| Corporativo | Personalizado | Personalizado | Cotización |

---

## 4. Suscripciones

Cada empresa debe tener una suscripción activa.

Estados:

- prueba
- activa
- vencida
- suspendida
- cancelada

Reglas:

- Al crear una empresa se asigna el plan Gratis.
- Si la suscripción está suspendida, la empresa solo puede acceder a facturación.
- El Super Admin puede cambiar el plan.

---

## 5. Facturación y Pagos

V1 tendrá pagos manuales.

Métodos iniciales:

- Transferencia bancaria.
- Depósito.
- Pago manual validado por Super Admin.

Estados de factura:

- pendiente
- pagada
- vencida
- anulada

Estados de pago:

- pendiente
- aprobado
- rechazado
- reversado

---

## 6. Sucursales

Campos:

- empresa_id
- nombre
- direccion
- latitud
- longitud
- radio_metros
- qr_token
- estado

Cada sucursal tendrá un QR fijo para la V1.

Ejemplo:

```txt
https://asistepro.com/marcar/qr_token
```

---

## 7. Empleados

Campos:

- empresa_id
- sucursal_habitual_id
- nombres
- apellidos
- cedula
- correo
- telefono
- cargo
- estado

---

## 8. Horarios

Campos:

- empresa_id
- nombre
- hora_entrada
- hora_salida
- tolerancia_minutos

---

## 9. Marcaciones QR + GPS

Tipos:

- entrada
- salida

Datos guardados:

- empresa_id
- usuario_id
- sucursal_id
- tipo
- fecha_hora
- latitud
- longitud
- distancia_metros
- estado
- motivo_novedad
- ip
- dispositivo

Regla principal:

```txt
Un empleado puede marcar en cualquier sucursal activa de su empresa si está dentro del radio GPS permitido.
```

Si marca en una sucursal distinta a su sucursal habitual:

```txt
La marcación se acepta, pero queda como aceptada_con_novedad.
```

Motivos:

- reemplazo
- apoyo_temporal
- emergencia
- autorizado_supervisor
- otro

---

# Control Anti-Suplantación

Medidas V1:

- Login obligatorio.
- GPS obligatorio.
- QR por sucursal.
- Registro de IP.
- Registro de dispositivo.
- Alerta si un mismo dispositivo marca por varios empleados.
- Alerta por cambios frecuentes de dispositivo.
- Historial de auditoría.

Medidas futuras:

- PIN de marcación.
- Dispositivo autorizado.
- Foto de evidencia opcional.
- QR dinámico.

---

# Reportes V1

Reportes:

- Asistencia diaria.
- Asistencia mensual.
- Atrasos.
- Faltas.
- Marcaciones por sucursal.
- Marcaciones con novedad.
- Exportación Excel.

Filtros:

- fecha inicio
- fecha fin
- empleado
- sucursal
- estado

---

# Seguridad

- HTTPS obligatorio en producción.
- Password hash con bcrypt.
- JWT con expiración corta.
- Refresh tokens.
- Validaciones con Zod.
- Rate limiting.
- Helmet.
- CORS controlado.
- Logs de auditoría.
- Backups de base de datos.
- Separación por tenant.

---

# Cumplimiento de Protección de Datos

AsistePro no usará huellas, reconocimiento facial ni datos biométricos.

Debe incluir:

- Política de privacidad.
- Aviso de tratamiento de datos.
- Consentimiento informado.
- Finalidad del tratamiento.
- Conservación limitada de datos.
- Derecho de acceso, rectificación y eliminación.

---

# MVP Vendible

La primera versión vendible debe incluir:

1. Login.
2. Multi-tenant por empresa.
3. Planes y suscripciones.
4. Facturación manual.
5. Empresas.
6. Sucursales.
7. Empleados.
8. Horarios.
9. QR fijo por sucursal.
10. Marcación con GPS.
11. Novedad por sucursal diferente.
12. Reportes.
13. Exportación Excel.
14. Panel Super Admin.
15. Panel Empresa.
16. Panel Empleado.
