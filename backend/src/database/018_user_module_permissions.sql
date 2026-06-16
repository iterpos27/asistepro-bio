BEGIN;

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS configuracion_modulos JSONB DEFAULT '{}'::jsonb;

UPDATE usuarios
SET configuracion_modulos = '{}'::jsonb
WHERE configuracion_modulos IS NULL;

COMMIT;
