import {
  Activity,
  Building2,
  CalendarClock,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  MapPin,
  ScanLine,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { routeRoles } from '../utils/roles';

export const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: routeRoles.empleado },
  { title: 'Empresas', href: '/empresas', icon: Building2, roles: routeRoles.superAdmin },
  { title: 'Planes', href: '/planes', icon: CreditCard, roles: routeRoles.superAdmin },
  { title: 'Suscripciones', href: '/suscripciones', icon: ShieldCheck, roles: routeRoles.superAdmin },
  { title: 'Sucursales', href: '/sucursales', icon: MapPin, roles: routeRoles.rrhh },
  { title: 'Empleados', href: '/empleados', icon: Users, roles: routeRoles.rrhh },
  { title: 'Horarios', href: '/horarios', icon: CalendarClock, roles: routeRoles.rrhh },
  { title: 'Marcar', href: '/marcaciones', icon: ScanLine, roles: routeRoles.empleado },
  { title: 'Mis marcaciones', href: '/mis-marcaciones', icon: Activity, roles: routeRoles.empleado },
  { title: 'Reportes', href: '/reportes', icon: FileBarChart, roles: routeRoles.rrhh },
  { title: 'Facturacion', href: '/facturacion', icon: CreditCard, roles: routeRoles.adminEmpresa },
  { title: 'Ajustes', href: '/settings', icon: Settings, roles: routeRoles.empleado },
];
