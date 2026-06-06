'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PersonAvatar } from '@/components/shared'
import { BranchMapClient } from '@/components/branch-map-client'
import { branches } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MapPin, Plus, Users, Radius, Building2 } from 'lucide-react'

export default function BranchesPage() {
  const [selected, setSelected] = useState(branches[0].id)
  const active = branches.find((b) => b.id === selected) ?? branches[0]

  return (
    <AppShell>
      <PageHeader
        title="Branches"
        description="Manage locations, geofence radius, and on-site coverage."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add branch
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-3">
          {branches.map((b) => {
            const pct = Math.round((b.present / b.employees) * 100)
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  selected === b.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-4.5" />
                    </span>
                    <div>
                      <p className="font-medium leading-tight">{b.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{b.city}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      b.status === 'active'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-warning/30 bg-warning/15 text-warning-foreground dark:text-warning'
                    }
                  >
                    {b.status}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {b.present}/{b.employees} on-site
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1.5 h-1.5" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <BranchMapClient
              key={active.id}
              lat={active.lat}
              lng={active.lng}
              radius={active.radius}
              name={active.name}
            />
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <Users className="size-4 text-muted-foreground" />
                <p className="mt-2 text-2xl font-semibold">{active.employees}</p>
                <p className="text-xs text-muted-foreground">Assigned staff</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <MapPin className="size-4 text-muted-foreground" />
                <p className="mt-2 text-2xl font-semibold">{active.present}</p>
                <p className="text-xs text-muted-foreground">Checked in today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Radius className="size-4 text-muted-foreground" />
                <p className="mt-2 text-2xl font-semibold">{active.radius}m</p>
                <p className="text-xs text-muted-foreground">Geofence radius</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium">{active.address}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Coordinates</span>
                <span className="font-mono text-xs">
                  {active.lat.toFixed(4)}, {active.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Branch manager</span>
                <span className="flex items-center gap-2 font-medium">
                  <PersonAvatar name={active.manager} className="size-6" />
                  {active.manager}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
