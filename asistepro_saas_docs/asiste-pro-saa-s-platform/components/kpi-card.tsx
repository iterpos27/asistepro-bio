import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'

export type KpiCardProps = {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'accent'
}

const toneMap = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning-foreground dark:text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  accent: 'bg-[var(--chart-3)]/15 text-[var(--chart-3)]',
}

export function KpiCard({
  label,
  value,
  delta,
  trend = 'up',
  icon: Icon,
  tone = 'primary',
}: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          {delta && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium',
                  trend === 'up'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive',
                )}
              >
                {trend === 'up' ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {delta}
              </span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-lg',
            toneMap[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
