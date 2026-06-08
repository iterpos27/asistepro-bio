import {
  Activity,
  Building2,
  CalendarClock,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
} from 'lucide-react';

export const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Empresas', href: '/empresas', icon: Building2 },
  { title: 'Planes', href: '/planes', icon: CreditCard },
  { title: 'Sucursales', href: '/sucursales', icon: MapPin },
  { title: 'Empleados', href: '/empleados', icon: Users },
  { title: 'Horarios', href: '/horarios', icon: CalendarClock },
  { title: 'Marcaciones', href: '/marcaciones', icon: Activity },
  { title: 'Reportes', href: '/reportes', icon: FileBarChart },
  { title: 'Facturacion', href: '/facturacion', icon: CreditCard },
  { title: 'Ajustes', href: '/settings', icon: Settings },
];
