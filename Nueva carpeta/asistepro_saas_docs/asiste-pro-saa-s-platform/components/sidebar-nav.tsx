'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navGroups } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { ScanFace } from 'lucide-react'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ScanFace className="size-5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold text-sidebar-foreground">
            AsistePro
          </span>
          <span className="text-[11px] text-muted-foreground">Attendance OS</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                      )}
                    >
                      <Icon
                        className={cn(
                          'size-[18px] shrink-0',
                          active
                            ? 'text-sidebar-primary'
                            : 'text-muted-foreground group-hover:text-sidebar-primary',
                        )}
                      />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
                          <span className="size-1.5 rounded-full bg-success" />
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">
            Growth plan
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            128 / 100 seats used
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-full rounded-full bg-warning" />
          </div>
          <Link
            href="/billing"
            onClick={onNavigate}
            className="mt-2.5 block text-[11px] font-medium text-primary hover:underline"
          >
            Upgrade plan →
          </Link>
        </div>
      </div>
    </div>
  )
}
