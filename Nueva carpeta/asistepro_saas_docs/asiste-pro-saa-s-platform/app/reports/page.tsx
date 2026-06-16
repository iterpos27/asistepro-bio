'use client'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/shared'
import { KpiCard } from '@/components/kpi-card'
import { TrendLineChart } from '@/components/charts'
import { reportRows, monthlyTrend } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download, FileText, Clock, TrendingUp, CalendarDays } from 'lucide-react'

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Reports"
        description="Attendance analytics, punctuality, and exportable summaries."
        actions={
          <div className="flex items-center gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-36">
                <CalendarDays className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">
              <Download className="size-4" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Avg. attendance rate"
          value="95.4%"
          delta="1.8%"
          trend="up"
          icon={TrendingUp}
          tone="primary"
        />
        <KpiCard
          label="Total hours worked"
          value="6,284h"
          delta="3.2%"
          trend="up"
          icon={Clock}
          tone="success"
        />
        <KpiCard
          label="Overtime logged"
          value="312h"
          delta="4.1%"
          trend="down"
          icon={Clock}
          tone="warning"
        />
        <KpiCard
          label="Reports generated"
          value="48"
          delta="12"
          trend="up"
          icon={FileText}
          tone="accent"
        />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance rate trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={monthlyTrend} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-medium">Per-employee summary</h2>
            <Button size="sm" variant="ghost">
              <Download className="size-4" />
              Download
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Branch</TableHead>
                  <TableHead className="text-right">Hours worked</TableHead>
                  <TableHead className="text-right">Late</TableHead>
                  <TableHead className="text-right">Absent</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Overtime</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRows.map((r) => (
                  <TableRow key={r.employee}>
                    <TableCell className="font-medium">{r.employee}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {r.branch}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.worked}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.late > 0 ? (
                        <span className="text-warning-foreground dark:text-warning">{r.late}</span>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.absent > 0 ? (
                        <span className="text-destructive">{r.absent}</span>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right tabular-nums">
                      {r.overtime}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`tabular-nums font-medium ${
                          r.rate >= 95
                            ? 'text-success'
                            : r.rate >= 85
                              ? 'text-warning-foreground dark:text-warning'
                              : 'text-destructive'
                        }`}
                      >
                        {r.rate}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
