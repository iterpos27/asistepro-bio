export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_EMPRESA: 'ADMIN_EMPRESA',
  RRHH: 'RRHH',
  EMPLEADO: 'EMPLEADO',
};

export const routeRoles = {
  superAdmin: [ROLES.SUPER_ADMIN],
  adminEmpresa: [ROLES.SUPER_ADMIN, ROLES.ADMIN_EMPRESA],
  rrhh: [ROLES.SUPER_ADMIN, ROLES.ADMIN_EMPRESA, ROLES.RRHH],
  empleado: [ROLES.SUPER_ADMIN, ROLES.ADMIN_EMPRESA, ROLES.RRHH, ROLES.EMPLEADO],
};

export function getRoleLabel(role) {
  const labels = {
    [ROLES.SUPER_ADMIN]: 'Super admin',
    [ROLES.ADMIN_EMPRESA]: 'Admin empresa',
    [ROLES.RRHH]: 'RRHH',
    [ROLES.EMPLEADO]: 'Empleado',
  };

  return labels[role] || 'Usuario';
}
