const { pool } = require('../config/database');
const { MODULES, buildEffectiveModules, normalizeModulePermissions } = require('../utils/module-permissions.util');

function allowedTargetRoles(actorRole) {
  if (actorRole === 'SUPER_ADMIN') return ['ADMIN_EMPRESA'];
  if (actorRole === 'ADMIN_EMPRESA') return ['RRHH', 'EMPLEADO'];
  return [];
}

function assertCanManageRole(actorRole, targetRole) {
  if (!allowedTargetRoles(actorRole).includes(targetRole)) {
    const error = new Error('No puede administrar permisos de este rol');
    error.statusCode = 403;
    throw error;
  }
}

async function listUsuariosPermisos({ empresaId, actorRole }) {
  const roles = allowedTargetRoles(actorRole);

  if (!roles.length) {
    return { modules: MODULES, items: [] };
  }

  const result = await pool.query(
    `
      SELECT
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.estado,
        u.configuracion_modulos AS usuario_configuracion_modulos,
        r.codigo AS rol_codigo,
        e.configuracion_modulos AS empresa_configuracion_modulos,
        emp.codigo AS empleado_codigo
      FROM usuarios u
      INNER JOIN roles r ON r.id = u.rol_id
      LEFT JOIN empresas e ON e.id = u.empresa_id
      LEFT JOIN empleados emp ON emp.usuario_id = u.id
      WHERE u.empresa_id = $1
        AND r.codigo = ANY($2)
      ORDER BY r.codigo ASC, u.nombre ASC, u.apellido ASC, u.email ASC
    `,
    [empresaId, roles],
  );

  return {
    modules: MODULES,
    items: result.rows.map((user) => ({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      estado: user.estado,
      rol: user.rol_codigo,
      empleado_codigo: user.empleado_codigo,
      modulos: buildEffectiveModules({
        empresaModules: user.empresa_configuracion_modulos,
        userModules: user.usuario_configuracion_modulos,
        role: user.rol_codigo,
      }),
      overrides: user.usuario_configuracion_modulos || {},
    })),
  };
}

async function updateUsuarioPermisos({ empresaId, actorRole, usuarioId, modulos }) {
  const userResult = await pool.query(
    `
      SELECT u.id, r.codigo AS rol_codigo
      FROM usuarios u
      INNER JOIN roles r ON r.id = u.rol_id
      WHERE u.empresa_id = $1
        AND u.id = $2
      LIMIT 1
    `,
    [empresaId, usuarioId],
  );

  const user = userResult.rows[0];
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  assertCanManageRole(actorRole, user.rol_codigo);

  const allowedKeys = new Set(MODULES.filter((module) => module.roles.includes(user.rol_codigo)).map((module) => module.key));
  const normalized = normalizeModulePermissions(modulos);
  const filtered = Object.fromEntries(Object.entries(normalized).filter(([key]) => allowedKeys.has(key)));

  await pool.query(
    `
      UPDATE usuarios
      SET configuracion_modulos = $3::jsonb,
          actualizado_en = NOW()
      WHERE empresa_id = $1
        AND id = $2
    `,
    [empresaId, usuarioId, JSON.stringify(filtered)],
  );

  return listUsuariosPermisos({ empresaId, actorRole });
}

module.exports = {
  listUsuariosPermisos,
  updateUsuarioPermisos,
};
