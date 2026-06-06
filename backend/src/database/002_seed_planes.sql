BEGIN;

INSERT INTO planes (
  codigo,
  nombre,
  descripcion,
  precio_mensual,
  limite_empleados,
  limite_sucursales
) VALUES
  (
    'starter',
    'Starter',
    'Plan inicial para empresas pequenas con una sucursal.',
    0,
    10,
    1
  ),
  (
    'growth',
    'Growth',
    'Plan para empresas en crecimiento con multiples sucursales.',
    49,
    100,
    10
  ),
  (
    'enterprise',
    'Enterprise',
    'Plan avanzado para organizaciones con operacion extendida.',
    149,
    NULL,
    NULL
  )
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  precio_mensual = EXCLUDED.precio_mensual,
  limite_empleados = EXCLUDED.limite_empleados,
  limite_sucursales = EXCLUDED.limite_sucursales,
  activo = TRUE,
  actualizado_en = NOW();

INSERT INTO roles (codigo, nombre, descripcion) VALUES
  ('SUPER_ADMIN', 'Super administrador', 'Acceso global a la plataforma SaaS.'),
  ('ADMIN_EMPRESA', 'Administrador de empresa', 'Administra la configuracion del tenant.'),
  ('RRHH', 'Recursos humanos', 'Gestiona empleados, horarios, marcaciones y reportes.'),
  ('EMPLEADO', 'Empleado', 'Registra asistencia y consulta informacion propia.')
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  actualizado_en = NOW();

COMMIT;
