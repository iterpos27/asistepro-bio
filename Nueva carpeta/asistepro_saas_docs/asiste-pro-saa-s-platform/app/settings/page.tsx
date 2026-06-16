'use client'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PersonAvatar } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Manage your account, organization, and attendance policies."
      />

      <Tabs defaultValue="profile" className="gap-6">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="rules">Attendance rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal information</CardTitle>
              <CardDescription>Update your profile details and credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <PersonAvatar name="Alex Morgan" className="size-16 text-lg" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Change photo</Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" defaultValue="Alex Morgan" />
                <Field label="Email" defaultValue="alex.morgan@asistepro.io" type="email" />
                <Field label="Job title" defaultValue="Operations Director" />
                <Field label="Phone" defaultValue="+1 (415) 555-0100" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization details</CardTitle>
              <CardDescription>Company-wide configuration and defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name" defaultValue="Northwind Retail Co." />
                <Field label="Industry" defaultValue="Retail & Hospitality" />
                <div className="grid gap-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific (PST/PDT)</SelectItem>
                      <SelectItem value="est">Eastern (EST/EDT)</SelectItem>
                      <SelectItem value="cet">Central Europe (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Week starts on</Label>
                  <Select defaultValue="mon">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mon">Monday</SelectItem>
                      <SelectItem value="sun">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save organization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance policies</CardTitle>
              <CardDescription>Control how check-ins are validated.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <ToggleRow
                title="GPS geofencing"
                description="Require employees to be within branch radius to check in."
                defaultChecked
              />
              <ToggleRow
                title="Device validation"
                description="Only allow check-ins from registered, trusted devices."
                defaultChecked
              />
              <ToggleRow
                title="Selfie verification"
                description="Capture a photo on each check-in for identity confirmation."
              />
              <ToggleRow
                title="Auto clock-out"
                description="Automatically clock out employees after scheduled shift end."
                defaultChecked
              />
              <div className="grid gap-4 pt-5 sm:grid-cols-2">
                <Field label="Late threshold (minutes)" defaultValue="10" type="number" />
                <Field label="Geofence buffer (meters)" defaultValue="50" type="number" />
              </div>
              <div className="flex justify-end pt-5">
                <Button>Save policies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification preferences</CardTitle>
              <CardDescription>Choose what alerts you receive and how.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <ToggleRow title="Late arrival alerts" description="Notify managers when an employee checks in late." defaultChecked />
              <ToggleRow title="Geofence violations" description="Immediate alert on out-of-bounds check-in attempts." defaultChecked />
              <ToggleRow title="Daily summary email" description="Receive a daily attendance digest at 6:00 PM." defaultChecked />
              <ToggleRow title="Overtime warnings" description="Alert when a branch exceeds weekly overtime limits." />
              <ToggleRow title="Weekly reports" description="Email a workforce performance report every Monday." defaultChecked />
              <div className="flex justify-end pt-5">
                <Button>Save preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}

function Field({
  label,
  defaultValue,
  type = 'text',
}: {
  label: string
  defaultValue?: string
  type?: string
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} type={type} />
    </div>
  )
}

function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  const [on, setOn] = useState(!!defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  )
}
