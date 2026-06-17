BEGIN;

WITH default_plan AS (
  SELECT id
  FROM planes
  WHERE codigo = 'enterprise'
  LIMIT 1
),
default_empresa AS (
  INSERT INTO empresas (
    plan_id,
    nombre,
    identificacion_fiscal,
    email,
    telefono,
    direccion,
    estado,
    configuracion_modulos
  )
  SELECT
    default_plan.id,
    'AsistePro Bio',
    'ASISTEPRO-BIO',
    'admin@asistepro-bio.local',
    NULL,
    'Empresa local por defecto',
    'activa',
    '{
      "sucursales": true,
      "empleados": true,
      "horarios": true,
      "reemplazos": true,
      "marcaciones": true,
      "mis_marcaciones": true,
      "reportes_avanzados": true,
      "facturacion": true
    }'::jsonb
  FROM default_plan
  ON CONFLICT DO NOTHING
  RETURNING id, plan_id
),
resolved_empresa AS (
  SELECT id, plan_id
  FROM default_empresa
  UNION ALL
  SELECT id, plan_id
  FROM empresas
  WHERE identificacion_fiscal = 'ASISTEPRO-BIO'
  LIMIT 1
),
upsert_subscription AS (
  INSERT INTO suscripciones (
    empresa_id,
    plan_id,
    estado,
    fecha_inicio,
    fecha_fin,
    monto_mensual
  )
  SELECT
    resolved_empresa.id,
    resolved_empresa.plan_id,
    'activa',
    CURRENT_DATE,
    NULL,
    0
  FROM resolved_empresa
  WHERE resolved_empresa.plan_id IS NOT NULL
  ON CONFLICT DO NOTHING
  RETURNING id
)
UPDATE usuarios
SET empresa_id = (SELECT id FROM resolved_empresa),
    actualizado_en = NOW()
WHERE email = 'iter27pos@gmail.com'
  AND empresa_id IS NULL;

COMMIT;
