'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: 'var(--muted-foreground)' },
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium text-popover-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function AttendanceBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} width={28} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
        <Bar dataKey="present" name="Present" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="late" name="Late" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" name="Absent" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CheckinsAreaChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: -16, right: 4, top: 4 }}>
        <defs>
          <linearGradient id="fillCheckins" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="hour" {...axisProps} />
        <YAxis {...axisProps} width={28} />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="checkins"
          name="Check-ins"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillCheckins)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BranchActivityChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function TrendLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} width={32} domain={[80, 100]} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="rate"
          name="Attendance rate"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--chart-2)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
