BEGIN;

ALTER TABLE pagos
ADD COLUMN IF NOT EXISTS estado VARCHAR(30) NOT NULL DEFAULT 'registrado';

ALTER TABLE pagos
ADD COLUMN IF NOT EXISTS anulado_en TIMESTAMPTZ;

ALTER TABLE pagos
ADD COLUMN IF NOT EXISTS motivo_anulacion TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pagos_estado_check'
  ) THEN
    ALTER TABLE pagos
    ADD CONSTRAINT pagos_estado_check CHECK (estado IN ('registrado', 'anulado'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);

COMMIT;
