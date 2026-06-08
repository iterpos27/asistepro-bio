import Dashboard from '../pages/dashboard/Dashboard';
import EmpleadosList from '../pages/empleados/EmpleadosList';
import EmpresasList from '../pages/empresas/EmpresasList';
import Facturas from '../pages/facturacion/Facturas';
import HorariosList from '../pages/horarios/HorariosList';
import HistorialMarcaciones from '../pages/marcaciones/HistorialMarcaciones';
import PlanesList from '../pages/planes/PlanesList';
import Reportes from '../pages/reportes/Reportes';
import Settings from '../pages/settings/Settings';
import SucursalesList from '../pages/sucursales/SucursalesList';

export const routeRoles = {
  superAdmin: ['SUPER_ADMIN'],
  adminEmpresa: ['SUPER_ADMIN', 'ADMIN_EMPRESA'],
  rrhh: ['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH'],
  empleado: ['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH', 'EMPLEADO'],
};

export const privateRoutes = [
  {
    path: '/dashboard',
    element: Dashboard,
    roles: routeRoles.empleado,
  },
  {
    path: '/admin',
    element: Dashboard,
    roles: routeRoles.empleado,
  },
  {
    path: '/empresas',
    element: EmpresasList,
    roles: routeRoles.adminEmpresa,
  },
  {
    path: '/planes',
    element: PlanesList,
    roles: routeRoles.superAdmin,
  },
  {
    path: '/sucursales',
    element: SucursalesList,
    roles: routeRoles.rrhh,
  },
  {
    path: '/empleados',
    element: EmpleadosList,
    roles: routeRoles.rrhh,
  },
  {
    path: '/horarios',
    element: HorariosList,
    roles: routeRoles.rrhh,
  },
  {
    path: '/marcaciones',
    element: HistorialMarcaciones,
    roles: routeRoles.empleado,
  },
  {
    path: '/mis-marcaciones',
    element: HistorialMarcaciones,
    roles: routeRoles.empleado,
  },
  {
    path: '/reportes',
    element: Reportes,
    roles: routeRoles.rrhh,
  },
  {
    path: '/facturacion',
    element: Facturas,
    roles: routeRoles.adminEmpresa,
  },
  {
    path: '/settings',
    element: Settings,
    roles: routeRoles.empleado,
  },
];
