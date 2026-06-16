import { SidebarNav } from '@/components/sidebar-nav'
import { Topbar } from '@/components/topbar'

export function AppShell({
  title = 'AsistePro',
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar md:block">
        <SidebarNav />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <Topbar title={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
