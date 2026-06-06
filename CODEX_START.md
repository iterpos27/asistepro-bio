# ASISTEPRO - INSTRUCCIONES MAESTRAS

## Descripción

ASISTEPRO es una plataforma SaaS Multi-Tenant para control de asistencia laboral mediante QR + GPS.

El sistema NO utiliza biometría.

Está diseñado para empresas con múltiples sucursales y empleados.

---

# Frontend Existente

Existe un frontend previamente diseñado en:

asiste-pro-saa-s-platform

Antes de generar cualquier código:

1. Analizar la estructura completa.
2. Analizar componentes.
3. Analizar páginas.
4. Analizar rutas.
5. Analizar dependencias.
6. Identificar elementos reutilizables.
7. No eliminar componentes existentes.
8. No rediseñar la interfaz.

Objetivo:

Conectar el frontend existente con el backend real.

---

# Stack Oficial

Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios
* React Hook Form
* Zod

Backend

* Node.js
* Express
* JavaScript

Base de Datos

* PostgreSQL

Driver

* pg

---

# No utilizar

* TypeScript
* Prisma
* Docker
* Sequelize
* TypeORM

---

# Arquitectura Backend

backend/

src/

config/
database/
controllers/
routes/
services/
middlewares/
utils/

---

# Arquitectura Frontend

asiste-pro-saa-s-platform/src/

components/
pages/
layouts/
routes/
services/
hooks/
context/
utils/

---

# Modelo SaaS

Cada empresa es un tenant.

Toda entidad debe incluir:

empresa_id

Toda consulta SQL debe filtrar por:

empresa_id

Implementar:

tenantGuard

---

# Roles

SUPER_ADMIN

ADMIN_EMPRESA

RRHH

EMPLEADO

---

# Seguridad

JWT

bcrypt

helmet

cors

express-rate-limit

dotenv

logs

auditoría

---

# Regla Principal

NO avanzar automáticamente.

Completar una fase.

Esperar aprobación.

Continuar con la siguiente fase.

---

# Forma de Trabajo

Para cada fase:

1. Explicar.
2. Mostrar estructura.
3. Generar código.
4. Generar SQL.
5. Mostrar endpoints.
6. Mostrar checklist.
7. Esperar aprobación.
