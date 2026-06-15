BEGIN;

INSERT INTO usuarios (
  empresa_id,
  rol_id,
  nombre,
  apellido,
  email,
  password_hash,
  estado
) VALUES (
  NULL,
  (SELECT id FROM roles WHERE codigo = 'SUPER_ADMIN'),
  'Super',
  'Admin',
  'iter27pos@gmail.com',
  '$2b$10$reemplazar.hash.en.fase.autenticacion',
  'activo'
)
ON CONFLICT (email) DO UPDATE SET
  rol_id = EXCLUDED.rol_id,
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  estado = EXCLUDED.estado,
  actualizado_en = NOW();

COMMIT;
