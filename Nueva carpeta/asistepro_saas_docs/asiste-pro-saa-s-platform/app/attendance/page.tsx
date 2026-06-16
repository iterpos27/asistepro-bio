import { AppShell } from '@/components/app-shell'
import { PageHeader, PersonAvatar } from '@/components/shared'
import { KpiCard } from '@/components/kpi-card'
import { CheckinsAreaChart } from '@/components/charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { liveAttendance, hourlyCheckins } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  MapPin,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Search,
  Radio,
  Activity,
  Wifi,
} from 'lucide-react'

export default function AttendancePage() {
  return (
    <AppShell title="Attendance">
      <PageHeader
        title="Real-time attendance"
        description="Live check-in feed with geolocation and device validation."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
            <Radio className="size-3.5 animate-pulse" />
            Live · updated just now
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Check-ins today" value="296" delta="4.1%" trend="up" icon={Activity} tone="primary" />
        <KpiCard label="Geo verified" value="98.6%" delta="0.4%" trend="up" icon={ShieldCheck} tone="success" />
        <KpiCard label="Geo flagged" value="4" delta="2" trend="down" icon={ShieldAlert} tone="destructive" />
        <KpiCard label="New devices" value="3" icon={Smartphone} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Check-ins by hour</CardTitle>
            <CardDescription>Distribution of clock-ins across the day</CardDescription>
          </CardHeader>
          <CardContent>
            <CheckinsAreaChart data={hourlyCheckins} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Validation rules</CardTitle>
            <CardDescription>Active enforcement</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <RuleRow icon={MapPin} title="Geofence radius" detail="Within branch perimeter" status="on" />
            <RuleRow icon={Wifi} title="IP allow-list" detail="Branch Wi-Fi networks" status="on" />
            <RuleRow icon={Smartphone} title="Device binding" detail="Trusted devices only" status="on" />
            <RuleRow icon={ShieldCheck} title="Selfie verification" detail="Face match on check-in" status="off" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Live feed</CardTitle>
            <CardDescription>Most recent attendance events</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Filter events..." className="h-9 pl-9" />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Employee</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Geolocation</TableHead>
                  <TableHead className="pr-6">Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveAttendance.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <PersonAvatar name={e.employee} />
                        <span className="font-medium">{e.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.branch}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {e.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{e.time}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 text-xs font-medium',
                          e.geo === 'verified' ? 'text-success' : 'text-destructive',
                        )}
                      >
                        {e.geo === 'verified' ? (
                          <ShieldCheck className="size-3.5" />
                        ) : (
                          <ShieldAlert className="size-3.5" />
                        )}
                        {e.geo === 'verified' ? `Verified · ${e.distance}` : `Flagged · ${e.distance}`}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
                          e.device === 'trusted'
                            ? 'border-border text-muted-foreground'
                            : 'border-warning/30 bg-warning/15 text-warning-foreground dark:text-warning',
                        )}
                      >
                        <Smartphone className="size-3" />
                        {e.device === 'trusted' ? 'Trusted' : 'New'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}

function RuleRow({
  icon: Icon,
  title,
  detail,
  status,
}: {
  icon: typeof MapPin
  title: string
  detail: string
  status: 'on' | 'off'
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-[11px] font-medium',
          status === 'on' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground',
        )}
      >
        {status === 'on' ? 'Enabled' : 'Off'}
      </span>
    </div>
  )
}
