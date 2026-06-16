// Mock data for the AsistePro platform

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'remote' | 'off'

export type Employee = {
  id: string
  name: string
  email: string
  role: string
  branch: string
  avatar: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  schedule: string
  phone: string
  department: string
}

export const employees: Employee[] = [
  {
    id: 'E-1042',
    name: 'Sofía Ramírez',
    email: 'sofia.ramirez@asistepro.io',
    role: 'Store Manager',
    branch: 'Downtown Flagship',
    avatar: '/avatars/avatar-1.png',
    status: 'present',
    checkIn: '08:52',
    checkOut: null,
    schedule: '09:00 - 18:00',
    phone: '+1 (415) 555-0142',
    department: 'Retail Operations',
  },
  {
    id: 'E-1043',
    name: 'Marcus Lee',
    email: 'marcus.lee@asistepro.io',
    role: 'Shift Supervisor',
    branch: 'Riverside Mall',
    avatar: '/avatars/avatar-2.png',
    status: 'late',
    checkIn: '09:24',
    checkOut: null,
    schedule: '09:00 - 17:00',
    phone: '+1 (415) 555-0177',
    department: 'Retail Operations',
  },
  {
    id: 'E-1044',
    name: 'Amara Okafor',
    email: 'amara.okafor@asistepro.io',
    role: 'Barista Lead',
    branch: 'Harbor Café',
    avatar: '/avatars/avatar-3.png',
    status: 'present',
    checkIn: '07:01',
    checkOut: null,
    schedule: '07:00 - 15:00',
    phone: '+1 (415) 555-0193',
    department: 'Food & Beverage',
  },
  {
    id: 'E-1045',
    name: 'Diego Fernández',
    email: 'diego.fernandez@asistepro.io',
    role: 'Warehouse Operator',
    branch: 'North Distribution',
    avatar: '/avatars/avatar-4.png',
    status: 'absent',
    checkIn: null,
    checkOut: null,
    schedule: '06:00 - 14:00',
    phone: '+1 (415) 555-0210',
    department: 'Logistics',
  },
  {
    id: 'E-1046',
    name: 'Priya Nair',
    email: 'priya.nair@asistepro.io',
    role: 'Customer Specialist',
    branch: 'Downtown Flagship',
    avatar: '/avatars/avatar-5.png',
    status: 'remote',
    checkIn: '08:45',
    checkOut: null,
    schedule: '09:00 - 18:00',
    phone: '+1 (415) 555-0231',
    department: 'Support',
  },
  {
    id: 'E-1047',
    name: 'Liam Walsh',
    email: 'liam.walsh@asistepro.io',
    role: 'Sales Associate',
    branch: 'Riverside Mall',
    avatar: '/avatars/avatar-6.png',
    status: 'present',
    checkIn: '08:58',
    checkOut: null,
    schedule: '09:00 - 17:00',
    phone: '+1 (415) 555-0256',
    department: 'Retail Operations',
  },
  {
    id: 'E-1048',
    name: 'Noor Haddad',
    email: 'noor.haddad@asistepro.io',
    role: 'Line Cook',
    branch: 'Harbor Café',
    avatar: '/avatars/avatar-7.png',
    status: 'late',
    checkIn: '07:38',
    checkOut: null,
    schedule: '07:00 - 15:00',
    phone: '+1 (415) 555-0288',
    department: 'Food & Beverage',
  },
  {
    id: 'E-1049',
    name: 'Hana Sato',
    email: 'hana.sato@asistepro.io',
    role: 'Inventory Clerk',
    branch: 'North Distribution',
    avatar: '/avatars/avatar-8.png',
    status: 'present',
    checkIn: '05:56',
    checkOut: null,
    schedule: '06:00 - 14:00',
    phone: '+1 (415) 555-0299',
    department: 'Logistics',
  },
]

export type Branch = {
  id: string
  name: string
  address: string
  city: string
  employees: number
  present: number
  radius: number
  lat: number
  lng: number
  status: 'active' | 'maintenance'
  manager: string
}

export const branches: Branch[] = [
  {
    id: 'B-01',
    name: 'Downtown Flagship',
    address: '212 Market Street',
    city: 'San Francisco, CA',
    employees: 42,
    present: 38,
    radius: 80,
    lat: 37.7897,
    lng: -122.4001,
    status: 'active',
    manager: 'Sofía Ramírez',
  },
  {
    id: 'B-02',
    name: 'Riverside Mall',
    address: '8 Riverside Plaza',
    city: 'Oakland, CA',
    employees: 28,
    present: 22,
    radius: 120,
    lat: 37.8044,
    lng: -122.2712,
    status: 'active',
    manager: 'Marcus Lee',
  },
  {
    id: 'B-03',
    name: 'Harbor Café',
    address: '45 Embarcadero',
    city: 'San Francisco, CA',
    employees: 16,
    present: 14,
    radius: 60,
    lat: 37.7955,
    lng: -122.3937,
    status: 'active',
    manager: 'Amara Okafor',
  },
  {
    id: 'B-04',
    name: 'North Distribution',
    address: '1900 Industrial Way',
    city: 'Richmond, CA',
    employees: 54,
    present: 41,
    radius: 200,
    lat: 37.9358,
    lng: -122.3477,
    status: 'maintenance',
    manager: 'Hana Sato',
  },
]

export type TimelineEvent = {
  time: string
  label: string
  detail: string
  type: 'in' | 'out' | 'break' | 'note'
}

export const todayTimeline: TimelineEvent[] = [
  { time: '08:52', label: 'Checked in', detail: 'Downtown Flagship · GPS verified', type: 'in' },
  { time: '11:00', label: 'Break started', detail: '15 min coffee break', type: 'break' },
  { time: '11:14', label: 'Break ended', detail: 'Back on the floor', type: 'note' },
  { time: '13:30', label: 'Lunch break', detail: '45 min · auto-deducted', type: 'break' },
  { time: '14:15', label: 'Resumed shift', detail: 'Geofence confirmed', type: 'note' },
]

// Weekly attendance for admin chart
export const weeklyAttendance = [
  { day: 'Mon', present: 168, absent: 12, late: 8 },
  { day: 'Tue', present: 172, absent: 9, late: 7 },
  { day: 'Wed', present: 165, absent: 15, late: 8 },
  { day: 'Thu', present: 174, absent: 7, late: 7 },
  { day: 'Fri', present: 178, absent: 5, late: 5 },
  { day: 'Sat', present: 142, absent: 22, late: 24 },
  { day: 'Sun', present: 96, absent: 40, late: 52 },
]

export const hourlyCheckins = [
  { hour: '6a', checkins: 18 },
  { hour: '7a', checkins: 42 },
  { hour: '8a', checkins: 88 },
  { hour: '9a', checkins: 124 },
  { hour: '10a', checkins: 36 },
  { hour: '11a', checkins: 12 },
  { hour: '12p', checkins: 8 },
  { hour: '1p', checkins: 22 },
  { hour: '2p', checkins: 31 },
]

export const branchActivity = [
  { name: 'Downtown', value: 38, fill: 'var(--chart-1)' },
  { name: 'Riverside', value: 22, fill: 'var(--chart-2)' },
  { name: 'Harbor', value: 14, fill: 'var(--chart-3)' },
  { name: 'North Dist.', value: 41, fill: 'var(--chart-4)' },
]

export type Alert = {
  id: string
  title: string
  detail: string
  level: 'critical' | 'warning' | 'info'
  time: string
}

export const alerts: Alert[] = [
  {
    id: 'a1',
    title: 'Geofence mismatch',
    detail: 'Diego Fernández attempted check-in 1.2km outside North Distribution.',
    level: 'critical',
    time: '6 min ago',
  },
  {
    id: 'a2',
    title: 'Repeated late arrivals',
    detail: 'Marcus Lee has been late 3 times this week at Riverside Mall.',
    level: 'warning',
    time: '24 min ago',
  },
  {
    id: 'a3',
    title: 'Unrecognized device',
    detail: 'New device used by Priya Nair — pending approval.',
    level: 'warning',
    time: '1 hr ago',
  },
  {
    id: 'a4',
    title: 'Overtime threshold',
    detail: 'North Distribution exceeded 120 overtime hours this week.',
    level: 'info',
    time: '2 hr ago',
  },
]

export type LiveAttendance = {
  id: string
  employee: string
  avatar: string
  branch: string
  time: string
  type: 'Check in' | 'Check out'
  geo: 'verified' | 'flagged'
  device: 'trusted' | 'new'
  distance: string
}

export const liveAttendance: LiveAttendance[] = [
  {
    id: 'l1',
    employee: 'Hana Sato',
    avatar: '/avatars/avatar-8.png',
    branch: 'North Distribution',
    time: '05:56:12',
    type: 'Check in',
    geo: 'verified',
    device: 'trusted',
    distance: '12 m',
  },
  {
    id: 'l2',
    employee: 'Amara Okafor',
    avatar: '/avatars/avatar-3.png',
    branch: 'Harbor Café',
    time: '07:01:44',
    type: 'Check in',
    geo: 'verified',
    device: 'trusted',
    distance: '4 m',
  },
  {
    id: 'l3',
    employee: 'Noor Haddad',
    avatar: '/avatars/avatar-7.png',
    branch: 'Harbor Café',
    time: '07:38:09',
    type: 'Check in',
    geo: 'verified',
    device: 'new',
    distance: '22 m',
  },
  {
    id: 'l4',
    employee: 'Sofía Ramírez',
    avatar: '/avatars/avatar-1.png',
    branch: 'Downtown Flagship',
    time: '08:52:33',
    type: 'Check in',
    geo: 'verified',
    device: 'trusted',
    distance: '8 m',
  },
  {
    id: 'l5',
    employee: 'Diego Fernández',
    avatar: '/avatars/avatar-4.png',
    branch: 'North Distribution',
    time: '08:59:01',
    type: 'Check in',
    geo: 'flagged',
    device: 'trusted',
    distance: '1.2 km',
  },
  {
    id: 'l6',
    employee: 'Marcus Lee',
    avatar: '/avatars/avatar-2.png',
    branch: 'Riverside Mall',
    time: '09:24:50',
    type: 'Check in',
    geo: 'verified',
    device: 'trusted',
    distance: '31 m',
  },
]

export type ReportRow = {
  employee: string
  branch: string
  worked: string
  late: number
  absent: number
  overtime: string
  rate: number
}

export const reportRows: ReportRow[] = [
  { employee: 'Sofía Ramírez', branch: 'Downtown Flagship', worked: '41h 20m', late: 0, absent: 0, overtime: '1h 20m', rate: 100 },
  { employee: 'Marcus Lee', branch: 'Riverside Mall', worked: '38h 05m', late: 3, absent: 0, overtime: '0h', rate: 92 },
  { employee: 'Amara Okafor', branch: 'Harbor Café', worked: '40h 00m', late: 0, absent: 0, overtime: '2h 10m', rate: 100 },
  { employee: 'Diego Fernández', branch: 'North Distribution', worked: '30h 15m', late: 1, absent: 1, overtime: '0h', rate: 78 },
  { employee: 'Priya Nair', branch: 'Downtown Flagship', worked: '39h 40m', late: 0, absent: 0, overtime: '0h 40m', rate: 98 },
  { employee: 'Liam Walsh', branch: 'Riverside Mall', worked: '37h 50m', late: 1, absent: 0, overtime: '0h', rate: 95 },
  { employee: 'Noor Haddad', branch: 'Harbor Café', worked: '36h 30m', late: 2, absent: 0, overtime: '0h', rate: 90 },
  { employee: 'Hana Sato', branch: 'North Distribution', worked: '42h 10m', late: 0, absent: 0, overtime: '2h 10m', rate: 100 },
]

export const monthlyTrend = [
  { month: 'Jan', rate: 94 },
  { month: 'Feb', rate: 95 },
  { month: 'Mar', rate: 93 },
  { month: 'Apr', rate: 96 },
  { month: 'May', rate: 97 },
  { month: 'Jun', rate: 95 },
  { month: 'Jul', rate: 98 },
  { month: 'Aug', rate: 96 },
]

export type Plan = {
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  current?: boolean
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    price: 0,
    description: 'For small teams testing the waters.',
    features: ['Up to 10 employees', '1 branch', 'Basic attendance', 'Email support'],
  },
  {
    name: 'Growth',
    price: 49,
    description: 'For growing multi-branch businesses.',
    features: ['Up to 100 employees', 'Unlimited branches', 'Geolocation validation', 'Advanced reports', 'Priority support'],
    highlighted: true,
    current: true,
  },
  {
    name: 'Enterprise',
    price: 149,
    description: 'For large organizations with custom needs.',
    features: ['Unlimited employees', 'Device validation & SSO', 'Custom roles & API', 'Dedicated CSM', '99.9% uptime SLA'],
  },
]

export type Invoice = {
  id: string
  date: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
  plan: string
}

export const invoices: Invoice[] = [
  { id: 'INV-2048', date: 'Aug 1, 2025', amount: '$49.00', status: 'paid', plan: 'Growth (monthly)' },
  { id: 'INV-2031', date: 'Jul 1, 2025', amount: '$49.00', status: 'paid', plan: 'Growth (monthly)' },
  { id: 'INV-2014', date: 'Jun 1, 2025', amount: '$49.00', status: 'paid', plan: 'Growth (monthly)' },
  { id: 'INV-1998', date: 'May 1, 2025', amount: '$49.00', status: 'paid', plan: 'Growth (monthly)' },
  { id: 'INV-1981', date: 'Apr 1, 2025', amount: '$29.00', status: 'paid', plan: 'Starter (monthly)' },
]
