BEGIN;

CREATE TABLE IF NOT EXISTS biometricos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    modelo VARCHAR(100),
    serial VARCHAR(100) UNIQUE NOT NULL,
    sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'offline',
    ultimo_sync TIMESTAMPTZ,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marcaciones_biometricas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    biometrico_serial VARCHAR(100) NOT NULL,
    empleado_codigo VARCHAR(100) NOT NULL,
    fecha_hora TIMESTAMPTZ NOT NULL,
    estado VARCHAR(50),
    verificacion VARCHAR(50),
    raw_data TEXT,
    procesado BOOLEAN DEFAULT FALSE,
    marcacion_id UUID REFERENCES marcaciones(id) ON DELETE SET NULL,
    error_procesamiento TEXT,
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (biometrico_serial, empleado_codigo, fecha_hora)
);

CREATE TABLE IF NOT EXISTS zkteco_logs (
    id SERIAL PRIMARY KEY,
    biometrico_serial VARCHAR(100),
    tipo VARCHAR(50),
    contenido TEXT,
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_biometricos_empresa_id ON biometricos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_biometricos_sucursal_id ON biometricos(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_marcaciones_biometricas_serial ON marcaciones_biometricas(biometrico_serial);
CREATE INDEX IF NOT EXISTS idx_marcaciones_biometricas_empleado ON marcaciones_biometricas(empleado_codigo);
CREATE INDEX IF NOT EXISTS idx_marcaciones_biometricas_procesado ON marcaciones_biometricas(procesado);

COMMIT;
