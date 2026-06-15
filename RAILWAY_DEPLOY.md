# Deploy en Railway

Este proyecto queda preparado para desplegarse como un solo servicio en Railway:

- Express sirve la API en `/api`.
- Express sirve el frontend compilado desde `frontend/dist`.
- El frontend de produccion usa `VITE_API_URL=/api`.

## Pasos

1. Crear un proyecto en Railway desde el repositorio.
2. Agregar un servicio PostgreSQL.
3. Conectar la variable `DATABASE_URL` del PostgreSQL al servicio web.
4. Configurar variables del servicio web:

```env
NODE_ENV=production
JWT_ACCESS_SECRET=coloca_un_secreto_largo
JWT_REFRESH_SECRET=coloca_otro_secreto_largo
RATE_LIMIT_MAX=1000
```

Opcional si usas un dominio externo o separas frontend/backend:

```env
CORS_ORIGIN=https://tu-dominio.com
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
DB_SSL=true
```

5. Deployar. Railway usara `nixpacks.toml`:

```bash
npm ci
npm ci --prefix frontend
npm run build --prefix frontend
npm run start
```

6. Ejecutar migraciones una vez contra la base de datos:

```bash
npm run migrate
```

## Validacion

Despues del deploy revisa:

```text
https://TU-APP.up.railway.app/api/health
https://TU-APP.up.railway.app
```

Si `/api/health` responde `ok: true` y el frontend abre login, el despliegue base esta correcto.
