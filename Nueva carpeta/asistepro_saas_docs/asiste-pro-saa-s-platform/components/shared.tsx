import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { AttendanceStatus } from '@/lib/data'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function PersonAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <Avatar className={cn('size-8 border border-border', className)}>
      <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string; dot: string }
> = {
  present: {
    label: 'Present',
    className: 'bg-success/10 text-success border-success/20',
    dot: 'bg-success',
  },
  late: {
    label: 'Late',
    className: 'bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning',
    dot: 'bg-warning',
  },
  absent: {
    label: 'Absent',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
  remote: {
    label: 'Remote',
    className: 'bg-accent text-accent-foreground border-transparent',
    dot: 'bg-[var(--chart-3)]',
  },
  off: {
    label: 'Day off',
    className: 'bg-muted text-muted-foreground border-transparent',
    dot: 'bg-muted-foreground',
  },
}

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        cfg.className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}
