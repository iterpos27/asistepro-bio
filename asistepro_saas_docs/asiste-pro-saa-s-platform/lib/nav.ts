import {
  LayoutDashboard,
  Clock,
  Users,
  Building2,
  FileBarChart,
  CreditCard,
  Settings,
  UserCircle,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
      { title: 'My Dashboard', href: '/dashboard', icon: UserCircle },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Attendance', href: '/attendance', icon: Clock, badge: 'Live' },
      { title: 'Employees', href: '/employees', icon: Users },
      { title: 'Branches', href: '/branches', icon: Building2 },
      { title: 'Reports', href: '/reports', icon: FileBarChart },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Billing', href: '/billing', icon: CreditCard },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]
