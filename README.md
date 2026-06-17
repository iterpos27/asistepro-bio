# AsistePro Bio

Version local separada de AsistePro para evolucionar hacia una instalacion monoempresa con integracion ZKTeco.

## Estado actual

- Backend Express + PostgreSQL.
- Frontend Vite + React.
- Base local sugerida: `asistepro_bio`.
- Documento de trabajo ZKTeco: `integracion_zkteco_asistepro.md`.

## Configuracion local

1. Crear la base PostgreSQL local:

   ```sql
   CREATE DATABASE asistepro_bio;
   ```

2. Configurar `backend/.env` desde `backend/.env.example`.

3. Ejecutar migraciones:

   ```bash
   npm run migrate
   ```

4. Levantar backend:

   ```bash
   npm run dev
   ```

5. Levantar frontend:

   ```bash
   cd frontend
   npm run dev
   ```

## Fases previstas

1. Separar la copia y validar ejecucion local.
2. Simplificar multi-tenant a monoempresa.
3. Agregar base ZKTeco: tablas, endpoints `/iclock` y logs.
4. Procesar marcaciones biometricas hacia `marcaciones`.
5. Agregar panel administrativo y pruebas reales con dispositivos.
