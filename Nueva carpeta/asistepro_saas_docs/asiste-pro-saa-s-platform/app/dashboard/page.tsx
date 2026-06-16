import { AppShell } from '@/components/app-shell'
import { PageHeader, StatusBadge } from '@/components/shared'
import { CheckInWidget } from '@/components/check-in-widget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { todayTimeline } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Clock, Coffee, LogIn, StickyNote, CalendarClock, TrendingUp } from 'lucide-react'

const scheduleToday = [
  { label: 'Shift', value: '09:00 — 18:00', icon: CalendarClock },
  { label: 'Break', value: '13:30 — 14:15', icon: Coffee },
  { label: 'Branch', value: 'Downtown Flagship', icon: Clock },
]

const weekStats = [
  { label: 'Hours this week', value: '32h 10m', sub: 'of 40h scheduled', pct: 80 },
  { label: 'Attendance rate', value: '98%', sub: 'last 30 days', pct: 98 },
  { label: 'Overtime', value: '1h 20m', sub: 'this pay period', pct: 30 },
]

const history = [
  { date: 'Thu, Aug 14', in: '08:52', out: '18:04', hours: '8h 12m', status: 'present' as const },
  { date: 'Wed, Aug 13', in: '09:01', out: '18:00', hours: '7h 59m', status: 'present' as const },
  { date: 'Tue, Aug 12', in: '09:18', out: '18:10', hours: '7h 52m', status: 'late' as const },
  { date: 'Mon, Aug 11', in: '08:49', out: '18:02', hours: '8h 13m', status: 'present' as const },
  { date: 'Fri, Aug 08', in: '—', out: '—', hours: '—', status: 'off' as const },
]

const timelineIcon = {
  in: LogIn,
  out: LogIn,
  break: Coffee,
  note: StickyNote,
}

export default function DashboardPage() {
  return (
    <AppShell title="My Dashboard">
      <PageHeader
        title="Good morning, Sofía"
        description="Here's your shift overview for today, Thursday, August 14."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CheckInWidget />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {weekStats.map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-5">
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today&apos;s schedule</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {scheduleToday.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="size-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="truncate text-sm font-medium">{s.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Activity timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative ml-2 border-l border-border">
              {todayTimeline.map((e, i) => {
                const Icon = timelineIcon[e.type]
                return (
                  <li key={i} className="mb-5 ml-5 last:mb-0">
                    <span
                      className={cn(
                        'absolute -left-[13px] flex size-6 items-center justify-center rounded-full ring-4 ring-card',
                        e.type === 'in'
                          ? 'bg-success/15 text-success'
                          : e.type === 'break'
                            ? 'bg-warning/20 text-warning-foreground dark:text-warning'
                            : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="size-3" />
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{e.label}</p>
                      <span className="font-mono text-xs text-muted-foreground">{e.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{e.detail}</p>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Attendance history</CardTitle>
            <span className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="size-3.5" /> 98% on-time
            </span>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Check in</TableHead>
                  <TableHead>Check out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead className="pr-6 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.date}>
                    <TableCell className="pl-6 font-medium">{h.date}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{h.in}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{h.out}</TableCell>
                    <TableCell className="text-sm">{h.hours}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <StatusBadge status={h.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
