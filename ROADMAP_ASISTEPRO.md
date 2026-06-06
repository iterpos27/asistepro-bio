# ROADMAP ASISTEPRO V1

## FASE 1

ANÁLISIS DEL FRONTEND EXISTENTE

Objetivos:

* Revisar asiste-pro-saa-s-platform
* Analizar componentes
* Analizar páginas
* Analizar rutas
* Analizar dependencias
* Identificar reutilización

Entregables:

* Informe técnico
* Mapa de pantallas
* Estructura final propuesta

No modificar código.

---

## FASE 2

BACKEND BASE

Crear:

* Express
* PostgreSQL
* pg
* dotenv
* cors
* helmet
* rate-limit

Endpoint:

GET /api/health

Entregables:

* Backend funcional
* Conexión PostgreSQL
* Variables de entorno

---

## FASE 3

BASE DE DATOS

Crear tablas:

empresas
planes
suscripciones
usuarios
roles

Generar:

001_schema.sql

002_seed_planes.sql

003_seed_super_admin.sql

---

## FASE 4

AUTENTICACIÓN

Login

Logout

Refresh Token

JWT

bcrypt

Roles

SUPER_ADMIN

ADMIN_EMPRESA

RRHH

EMPLEADO

---

## FASE 5

MULTI TENANT

Implementar:

tenantGuard

planGuard

subscriptionGuard

Validar:

empresa_id

en todas las consultas.

---

## FASE 6

EMPRESAS

CRUD completo

---

## FASE 7

PLANES Y SUSCRIPCIONES

CRUD completo

Facturación básica

Pagos manuales

---

## FASE 8

SUCURSALES

CRUD completo

QR por sucursal

radio_metros

latitud

longitud

---

## FASE 9

EMPLEADOS

CRUD completo

sucursal_habitual

---

## FASE 10

HORARIOS

CRUD completo

---

## FASE 11

MARCACIONES

Proceso:

1. Login
2. Escanear QR
3. Obtener GPS
4. Calcular distancia
5. Registrar asistencia

Estados:

aceptada

aceptada_con_novedad

rechazada

---

## REGLA DE NOVEDADES

Si empleado marca en sucursal distinta:

No bloquear.

Solicitar motivo:

* Reemplazo
* Apoyo temporal
* Emergencia
* Autorización supervisor
* Otro

Registrar:

aceptada_con_novedad

---

## FASE 12

REPORTES

Asistencia diaria

Asistencia mensual

Novedades

Exportación Excel

---

## FASE 13

FACTURACIÓN

Facturas

Pagos

Suscripciones

Planes

---

## FASE 14

DASHBOARD FINAL

KPIs

Estadísticas

Métricas

---

## CRITERIO DE FINALIZACIÓN

Cada fase debe incluir:

* Código
* SQL
* Endpoints
* Checklist
* Pruebas básicas

Esperar aprobación antes de continuar.
