import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/shared'
import { KpiCard } from '@/components/kpi-card'
import {
  AttendanceBarChart,
  BranchActivityChart,
} from '@/components/charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  weeklyAttendance,
  branchActivity,
  alerts,
  branches,
} from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  Bell,
  Info,
  Download,
  CalendarDays,
} from 'lucide-react'

const alertConfig = {
  critical: { icon: AlertTriangle, className: 'bg-destructive/10 text-destructive' },
  warning: { icon: Bell, className: 'bg-warning/15 text-warning-foreground dark:text-warning' },
  info: { icon: Info, className: 'bg-accent text-accent-foreground' },
}

export default function AdminDashboardPage() {
  const totalEmployees = branches.reduce((a, b) => a + b.employees, 0)
  const totalPresent = branches.reduce((a, b) => a + b.present, 0)

  return (
    <AppShell title="Admin Dashboard">
      <PageHeader
        title="Overview"
        description="Real-time attendance across all branches · Thursday, August 14"
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarDays className="size-4" />
              This week
            </Button>
            <Button size="sm">
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Employees present" value={String(totalPresent)} delta="3.2%" trend="up" icon={UserCheck} tone="success" />
        <KpiCard label="Absent today" value="33" delta="1.1%" trend="down" icon={UserX} tone="destructive" />
        <KpiCard label="Late arrivals" value="11" delta="0.8%" trend="down" icon={Clock} tone="warning" />
        <KpiCard label="Total workforce" value={String(totalEmployees)} delta="5 new" trend="up" icon={Users} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Weekly attendance</CardTitle>
            <CardDescription>Present, late and absent across the workforce</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceBarChart data={weeklyAttendance} />
            <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted-foreground">
              <Legend color="var(--chart-1)" label="Present" />
              <Legend color="var(--chart-4)" label="Late" />
              <Legend color="var(--chart-5)" label="Absent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Branch activity</CardTitle>
            <CardDescription>Currently checked in</CardDescription>
          </CardHeader>
          <CardContent>
            <BranchActivityChart data={branchActivity} />
            <div className="mt-2 flex flex-col gap-2">
              {branchActivity.map((b) => (
                <div key={b.name} className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full" style={{ background: b.fill }} />
                  <span className="flex-1 text-muted-foreground">{b.name}</span>
                  <span className="font-medium tabular-nums">{b.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Branch status</CardTitle>
            <CardDescription>Live presence by location</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {branches.map((b) => {
              const pct = Math.round((b.present / b.employees) * 100)
              return (
                <div key={b.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.city}</p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                        b.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/15 text-warning-foreground dark:text-warning',
                      )}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-semibold tabular-nums">
                      {b.present}
                      <span className="text-sm font-normal text-muted-foreground">/{b.employees}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{pct}% present</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alerts</CardTitle>
            <CardDescription>Needs attention</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {alerts.map((a) => {
              const cfg = alertConfig[a.level]
              const Icon = cfg.icon
              return (
                <div key={a.id} className="flex gap-3 rounded-lg border border-border p-3">
                  <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', cfg.className)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{a.detail}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
