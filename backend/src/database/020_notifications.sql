BEGIN;

CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(160) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(40) NOT NULL, -- 'marcacion_novedad', 'reemplazo', 'horario', 'factura', 'general'
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id_leido ON notificaciones(usuario_id, leido);

COMMIT;
