BEGIN;

CREATE TABLE IF NOT EXISTS sucursales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nombre VARCHAR(160) NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  direccion TEXT,
  ciudad VARCHAR(120),
  latitud NUMERIC(10, 7) NOT NULL,
  longitud NUMERIC(10, 7) NOT NULL,
  radio_metros INTEGER NOT NULL DEFAULT 100,
  qr_token TEXT NOT NULL UNIQUE,
  estado VARCHAR(30) NOT NULL DEFAULT 'activa',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sucursales_estado_check CHECK (estado IN ('activa', 'inactiva', 'mantenimiento')),
  CONSTRAINT sucursales_radio_metros_check CHECK (radio_metros > 0),
  CONSTRAINT sucursales_latitud_check CHECK (latitud >= -90 AND latitud <= 90),
  CONSTRAINT sucursales_longitud_check CHECK (longitud >= -180 AND longitud <= 180),
  CONSTRAINT sucursales_empresa_codigo_unique UNIQUE (empresa_id, codigo)
);

CREATE INDEX IF NOT EXISTS idx_sucursales_empresa_id ON sucursales(empresa_id);
CREATE INDEX IF NOT EXISTS idx_sucursales_estado ON sucursales(estado);
CREATE INDEX IF NOT EXISTS idx_sucursales_qr_token ON sucursales(qr_token);

COMMIT;
