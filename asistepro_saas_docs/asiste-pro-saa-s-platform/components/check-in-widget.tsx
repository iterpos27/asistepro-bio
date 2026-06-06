'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogIn, LogOut, MapPin, Loader2, CheckCircle2 } from 'lucide-react'

export function CheckInWidget() {
  const [now, setNow] = useState<Date | null>(null)
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  function toggle() {
    setPending(true)
    setTimeout(() => {
      if (!checkedIn) {
        setCheckedIn(true)
        setCheckInTime(
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        )
      } else {
        setCheckedIn(false)
        setCheckInTime(null)
      }
      setPending(false)
    }, 1200)
  }

  const timeString = now
    ? now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '--:--:--'
  const dateString = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : ''

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{dateString}</p>
          <p className="mt-1 font-mono text-4xl font-semibold tabular-nums tracking-tight">
            {timeString}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
            checkedIn
              ? 'border-success/20 bg-success/10 text-success'
              : 'border-border bg-muted text-muted-foreground',
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              checkedIn ? 'animate-pulse bg-success' : 'bg-muted-foreground',
            )}
          />
          {checkedIn ? 'On shift' : 'Off shift'}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
        <MapPin className="size-4 text-success" />
        <span className="text-muted-foreground">
          Downtown Flagship · <span className="text-success font-medium">inside geofence</span>
        </span>
      </div>

      {checkedIn && checkInTime && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-success" />
          Checked in at <span className="font-medium text-foreground">{checkInTime}</span>
        </div>
      )}

      <Button
        size="lg"
        onClick={toggle}
        disabled={pending}
        variant={checkedIn ? 'outline' : 'default'}
        className={cn(
          'h-12 w-full text-base',
          checkedIn && 'border-destructive/30 text-destructive hover:bg-destructive/5',
        )}
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : checkedIn ? (
          <LogOut className="size-5" />
        ) : (
          <LogIn className="size-5" />
        )}
        {pending
          ? 'Verifying location...'
          : checkedIn
            ? 'Check out'
            : 'Check in'}
      </Button>
    </div>
  )
}
