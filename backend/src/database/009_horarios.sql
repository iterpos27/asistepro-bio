BEGIN;

CREATE TABLE IF NOT EXISTS horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT,
  dias_semana SMALLINT[] NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  tolerancia_minutos INTEGER NOT NULL DEFAULT 10,
  descanso_minutos INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT horarios_tolerancia_check CHECK (tolerancia_minutos >= 0),
  CONSTRAINT horarios_descanso_check CHECK (descanso_minutos >= 0),
  CONSTRAINT horarios_dias_semana_check CHECK (
    array_length(dias_semana, 1) IS NOT NULL
    AND dias_semana <@ ARRAY[1,2,3,4,5,6,7]::SMALLINT[]
  )
);

CREATE TABLE IF NOT EXISTS empleado_horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  empleado_id UUID NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
  horario_id UUID NOT NULL REFERENCES horarios(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT empleado_horarios_fechas_check CHECK (
    fecha_fin IS NULL OR fecha_fin >= fecha_inicio
  )
);

CREATE INDEX IF NOT EXISTS idx_horarios_empresa_id ON horarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_horarios_sucursal_id ON horarios(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_horarios_activo ON horarios(activo);
CREATE INDEX IF NOT EXISTS idx_empleado_horarios_empresa_id ON empleado_horarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_empleado_horarios_empleado_id ON empleado_horarios(empleado_id);
CREATE INDEX IF NOT EXISTS idx_empleado_horarios_horario_id ON empleado_horarios(horario_id);
CREATE INDEX IF NOT EXISTS idx_empleado_horarios_activo ON empleado_horarios(activo);

COMMIT;
