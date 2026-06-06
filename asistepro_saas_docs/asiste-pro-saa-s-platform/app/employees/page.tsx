'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PersonAvatar, StatusBadge } from '@/components/shared'
import { employees, type Employee } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreHorizontal, Mail, Phone, Clock, MapPin, Building2 } from 'lucide-react'

const branchList = ['All branches', ...Array.from(new Set(employees.map((e) => e.branch)))]

export default function EmployeesPage() {
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('All branches')
  const [selected, setSelected] = useState<Employee | null>(null)

  const filtered = employees.filter((e) => {
    const matchesQuery =
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.role.toLowerCase().includes(query.toLowerCase()) ||
      e.id.toLowerCase().includes(query.toLowerCase())
    const matchesBranch = branch === 'All branches' || e.branch === branch
    return matchesQuery && matchesBranch
  })

  return (
    <AppShell>
      <PageHeader
        title="Employees"
        description="Directory of all team members across your branches."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add employee
          </Button>
        }
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, role, or ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {branchList.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Branch</TableHead>
                <TableHead className="hidden lg:table-cell">Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Check-in</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow
                  key={e.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(e)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <PersonAvatar name={e.name} />
                      <div>
                        <p className="font-medium leading-tight">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {e.branch}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm tabular-nums text-muted-foreground">
                    {e.schedule}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={e.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm tabular-nums">
                    {e.checkIn ?? '—'}
                  </TableCell>
                  <TableCell onClick={(ev) => ev.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelected(e)}>
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit schedule</DropdownMenuItem>
                        <DropdownMenuItem>Send message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No employees match your filters.
            </p>
          )}
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">Employee profile</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-4">
                <PersonAvatar name={selected.name} className="size-14 text-base" />
                <div>
                  <p className="text-lg font-semibold">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selected.role} · {selected.id}
                  </p>
                  <div className="mt-1.5">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
              </div>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
                <Detail icon={Mail} label="Email" value={selected.email} />
                <Detail icon={Phone} label="Phone" value={selected.phone} />
                <Detail icon={Building2} label="Department" value={selected.department} />
                <Detail icon={MapPin} label="Branch" value={selected.branch} />
                <Detail icon={Clock} label="Schedule" value={selected.schedule} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Edit profile</Button>
                <Button variant="outline" className="flex-1">
                  View attendance
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}
