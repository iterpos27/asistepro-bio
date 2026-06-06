BEGIN;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  revocado BOOLEAN NOT NULL DEFAULT FALSE,
  expira_en TIMESTAMPTZ NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revocado_en TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario_id ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revocado ON refresh_tokens(revocado);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expira_en ON refresh_tokens(expira_en);

UPDATE usuarios
SET password_hash = '$2b$10$WfrS8Wcj8HRjsZQSZU.BouvU1pgPZzK4YKfKWg2Cv.kulf93A0hfO',
    actualizado_en = NOW()
WHERE email = 'superadmin@asistepro.local'
  AND password_hash = '$2b$10$reemplazar.hash.en.fase.autenticacion';

COMMIT;
