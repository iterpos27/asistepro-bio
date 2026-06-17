o# INTEGRACIÓN ZKTECO CON ASISTEPRO

## Objetivo

Integrar biométricos ZKTeco G1 y MB10-VL dentro de AsistePro para automatizar el registro de asistencia de empleados en múltiples sucursales.

La integración debe ser compatible con la arquitectura actual:

```txt
Frontend → Vercel
Backend → Render
Base de Datos → Supabase PostgreSQL
Fotos → Cloudflare R2
```

Sin migrar la plataforma completa a un VPS.

---

# IMPORTANTE: FASE DE ANÁLISIS OBLIGATORIA

Antes de implementar cualquier cambio, analizar completamente el proyecto existente.

## Revisar

* Estructura del backend.
* Estructura del frontend.
* Configuración PostgreSQL.
* Tablas existentes.
* Sistema actual de autenticación.
* Sistema actual de asistencia.
* Modelo actual de empleados.
* Relaciones existentes.

## Restricciones

NO modificar:

* Tabla de asistencia existente.
* Módulo de asistencia existente.
* Módulo de empleados existente.

Hasta entender completamente cómo funcionan.

Primero generar un informe técnico indicando:

```txt
Archivos encontrados
Tablas encontradas
Dependencias detectadas
Posibles impactos
Archivos que deberán modificarse
```

No realizar cambios automáticos sin presentar primero el análisis.

---

# ARQUITECTURA OBJETIVO

```txt
Biométricos ZKTeco
        ↓
Endpoints ADMS/iClock
        ↓
Tabla marcaciones_biometricas
        ↓
Servicio de procesamiento
        ↓
Tabla actual de asistencia de AsistePro
        ↓
Dashboard Administrativo
```

---

# OBJETIVOS FUNCIONALES

El sistema debe permitir:

1. Registrar biométricos.
2. Recibir marcaciones.
3. Procesar marcaciones.
4. Crear asistencia automáticamente.
5. Actualizar asistencia existente.
6. Gestionar múltiples sucursales.
7. Visualizar estado de dispositivos.
8. Auditar errores.
9. Reprocesar marcaciones.

---

# ENDPOINTS ZKTECO

Crear:

```txt
GET  /iclock/test
GET  /iclock/cdata
POST /iclock/cdata
GET  /iclock/getrequest
POST /iclock/devicecmd
```

Estos endpoints deben ser compatibles con ADMS/iClock.

---

# ESTRUCTURA BACKEND

Crear o adaptar:

```txt
backend/src/
├── routes/
│   └── zktecoRoutes.js
│
├── controllers/
│   └── zktecoController.js
│
├── services/
│   ├── zktecoService.js
│   └── biometricoAsistenciaService.js
│
├── repositories/
│   └── zktecoRepository.js
│
└── jobs/
    └── procesarMarcacionesJob.js
```

Respetar la arquitectura existente si utiliza otra organización.

---

# BASE DE DATOS

Crear únicamente si no existen estructuras equivalentes.

## Tabla biométricos

```sql
CREATE TABLE biometricos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    modelo VARCHAR(100),
    serial VARCHAR(100) UNIQUE NOT NULL,
    sucursal_id INTEGER,
    estado VARCHAR(20) DEFAULT 'offline',
    ultimo_sync TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Tabla marcaciones_biometricas

```sql
CREATE TABLE marcaciones_biometricas (
    id SERIAL PRIMARY KEY,
    biometrico_serial VARCHAR(100) NOT NULL,
    empleado_codigo VARCHAR(100) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    estado VARCHAR(50),
    verificacion VARCHAR(50),
    raw_data TEXT,
    procesado BOOLEAN DEFAULT FALSE,
    asistencia_id INTEGER,
    error_procesamiento TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
        biometrico_serial,
        empleado_codigo,
        fecha_hora
    )
);
```

---

## Tabla zkteco_logs

```sql
CREATE TABLE zkteco_logs (
    id SERIAL PRIMARY KEY,
    biometrico_serial VARCHAR(100),
    tipo VARCHAR(50),
    contenido TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# RECEPCIÓN DE MARCACIONES

Cuando llegue una marcación:

```txt
POST /iclock/cdata
```

El sistema debe:

1. Leer SN.
2. Identificar biométrico.
3. Registrar o actualizar biométrico.
4. Parsear ATTLOG.
5. Guardar en marcaciones_biometricas.
6. Evitar duplicados.
7. Registrar logs.
8. Responder OK.

---

# PROCESAMIENTO DE ASISTENCIA

Crear servicio:

```js
procesarMarcacionBiometrica()
```

Flujo:

```txt
Marcación
↓
Buscar empleado
↓
Buscar asistencia del día
↓
Crear o actualizar asistencia
↓
Guardar referencia
↓
Marcar como procesado
```

IMPORTANTE:

Adaptar esta lógica a la tabla actual de asistencia encontrada durante la fase de análisis.

NO asumir nombres de tablas.

NO asumir nombres de columnas.

---

# MULTISUCURSAL

Preparar soporte para:

```txt
Sucursal Quito
Sucursal Guayaquil
Sucursal Cuenca
Sucursal Ambato
...
```

Cada biométrico debe pertenecer a una sucursal.

Cada marcación debe poder asociarse a una sucursal.

---

# PANEL ADMINISTRADOR

Crear rutas:

```txt
/dashboard/biometricos
/dashboard/marcaciones-biometricas
/dashboard/asistencia-biometrica
```

Funcionalidades:

* Listar biométricos.
* Estado online/offline.
* Última sincronización.
* Ver marcaciones.
* Ver errores.
* Filtrar.
* Reprocesar marcaciones.

---

# ENDPOINTS ADMINISTRATIVOS

```txt
GET  /api/biometricos
GET  /api/marcaciones-biometricas
GET  /api/marcaciones-biometricas/:id
POST /api/marcaciones-biometricas/:id/procesar
POST /api/marcaciones-biometricas/procesar-pendientes
GET  /api/asistencia-biometrica/resumen
```

Proteger con autenticación existente.

---

# SEGURIDAD

Variables de entorno:

```env
ZKTECO_ALLOW_AUTO_REGISTER=true
ZKTECO_REQUIRE_REGISTERED_DEVICE=false
```

Implementar:

* Logs.
* Control de seriales.
* Validación de dispositivos.
* Auditoría.
* Reintentos.

No proteger endpoints iClock con JWT.

---

# COMPATIBILIDAD CON RENDER

Asegurar:

```js
const PORT = process.env.PORT || 4000;
```

Rutas públicas:

```txt
https://api.asistepro.com/iclock/test
https://api.asistepro.com/iclock/cdata
https://api.asistepro.com/iclock/getrequest
```

---

# FASES DE IMPLEMENTACIÓN

## Fase 1

Análisis del proyecto existente.

Entregar informe.

No modificar código.

---

## Fase 2

Implementar tablas.

Implementar endpoints iClock.

Implementar logs.

---

## Fase 3

Implementar procesamiento de marcaciones.

Integrar con asistencia existente.

---

## Fase 4

Panel administrativo.

Filtros.

Reprocesamiento.

---

## Fase 5

Pruebas reales con:

* ZKTeco G1
* ZKTeco MB10-VL

---

# RESULTADO FINAL

AsistePro debe poder:

✅ Recibir marcaciones ZKTeco

✅ Gestionar múltiples sucursales

✅ Procesar asistencia automáticamente

✅ Mantener intacta la lógica actual

✅ Auditar errores

✅ Reprocesar marcaciones

✅ Escalar a nuevos modelos ZKTeco en el futuro


ojo: trabajar de forma local hasta validar las conecciones 
