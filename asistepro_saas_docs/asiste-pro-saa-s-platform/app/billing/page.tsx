'use client'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/shared'
import { plans, invoices } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, CreditCard, Download, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const invoiceStatus = {
  paid: 'border-success/30 bg-success/10 text-success',
  pending: 'border-warning/30 bg-warning/15 text-warning-foreground dark:text-warning',
  failed: 'border-destructive/30 bg-destructive/10 text-destructive',
}

export default function BillingPage() {
  return (
    <AppShell>
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription, usage, and payment history."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Current usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <UsageBar label="Employees" used={140} total={100} unit="seats" over />
            <UsageBar label="Branches" used={4} total={999} unit="locations" />
            <UsageBar label="API requests" used={62} total={100} unit="k / month" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium">Visa ending 4242</p>
                <p className="text-xs text-muted-foreground">Expires 09/27</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Update payment method
            </Button>
            <p className="text-xs text-muted-foreground">
              Next charge of $49.00 on September 1, 2025.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 text-lg font-semibold">Plans</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'relative flex flex-col',
              plan.highlighted && 'border-primary ring-1 ring-primary/30',
            )}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-2.5 left-6 gap-1 bg-primary">
                <Sparkles className="size-3" />
                Most popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">${plan.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.current ? 'outline' : plan.highlighted ? 'default' : 'secondary'}
                disabled={plan.current}
              >
                {plan.current ? 'Current plan' : `Switch to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-0">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-medium">Invoice history</h2>
          <Button size="sm" variant="ghost">
            <Download className="size-4" />
            Download all
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {inv.plan}
                  </TableCell>
                  <TableCell className="tabular-nums">{inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('capitalize', invoiceStatus[inv.status])}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Download className="size-4" />
                      <span className="sr-only">Download receipt</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  )
}

function UsageBar({
  label,
  used,
  total,
  unit,
  over,
}: {
  label: string
  used: number
  total: number
  unit: string
  over?: boolean
}) {
  const pct = Math.min(Math.round((used / total) * 100), 100)
  const unlimited = total >= 999
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn('tabular-nums', over ? 'text-destructive' : 'text-muted-foreground')}>
          {used} {unlimited ? unit : `/ ${total} ${unit}`}
        </span>
      </div>
      <Progress
        value={unlimited ? 30 : pct}
        className={cn('h-2', over && '[&>div]:bg-destructive')}
      />
      {over && (
        <p className="mt-1 text-xs text-destructive">
          Over plan limit — upgrade to Enterprise to add more seats.
        </p>
      )}
    </div>
  )
}
