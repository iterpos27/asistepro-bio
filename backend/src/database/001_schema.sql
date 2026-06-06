BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  precio_mensual NUMERIC(10, 2) NOT NULL DEFAULT 0,
  limite_empleados INTEGER,
  limite_sucursales INTEGER,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES planes(id),
  nombre VARCHAR(160) NOT NULL,
  identificacion_fiscal VARCHAR(40),
  email VARCHAR(160),
  telefono VARCHAR(40),
  direccion TEXT,
  estado VARCHAR(30) NOT NULL DEFAULT 'activa',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT empresas_estado_check CHECK (estado IN ('activa', 'suspendida', 'cancelada'))
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  rol_id UUID NOT NULL REFERENCES roles(id),
  nombre VARCHAR(120) NOT NULL,
  apellido VARCHAR(120),
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  telefono VARCHAR(40),
  estado VARCHAR(30) NOT NULL DEFAULT 'activo',
  ultimo_acceso_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT usuarios_estado_check CHECK (estado IN ('activo', 'inactivo', 'bloqueado')),
  CONSTRAINT usuarios_empresa_requerida_check CHECK (
    empresa_id IS NOT NULL OR email = 'superadmin@asistepro.local'
  )
);

CREATE TABLE IF NOT EXISTS suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES planes(id),
  estado VARCHAR(30) NOT NULL DEFAULT 'activa',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  monto_mensual NUMERIC(10, 2) NOT NULL DEFAULT 0,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT suscripciones_estado_check CHECK (
    estado IN ('activa', 'vencida', 'cancelada', 'suspendida')
  )
);

CREATE INDEX IF NOT EXISTS idx_empresas_plan_id ON empresas(plan_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_empresa_id ON suscripciones(empresa_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_plan_id ON suscripciones(plan_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_estado ON suscripciones(estado);

COMMIT;
