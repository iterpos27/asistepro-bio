'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ScanFace,
  MapPin,
  ShieldCheck,
  BarChart3,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'

const highlights = [
  {
    icon: MapPin,
    title: 'Geolocation check-in',
    detail: 'Validate every clock-in against branch geofences in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Device validation',
    detail: 'Block unrecognized devices and stop buddy-punching for good.',
  },
  {
    icon: BarChart3,
    title: 'Advanced reporting',
    detail: 'Late arrivals, absences and overtime across every branch.',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/admin'), 900)
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand / marketing panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:w-[46%]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <ScanFace className="size-5" />
          </div>
          <span className="text-lg font-semibold">AsistePro</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight">
            Attendance management built for multi-branch teams.
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-primary-foreground/80">
            Track presence, validate locations and surface insights across
            every store, restaurant and warehouse — from one premium console.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/12 backdrop-blur">
                  <h.icon className="size-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="text-xs leading-relaxed text-primary-foreground/70">
                    {h.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-xs text-primary-foreground/70">
          <div className="flex -space-x-2">
            {['SR', 'ML', 'AO', 'PN'].map((i) => (
              <div
                key={i}
                className="flex size-7 items-center justify-center rounded-full border-2 border-primary bg-white/15 text-[10px] font-medium backdrop-blur"
              >
                {i}
              </div>
            ))}
          </div>
          Trusted by 1,200+ teams across retail, hospitality and logistics.
        </div>
      </section>

      {/* Login form */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ScanFace className="size-5" />
            </div>
            <span className="text-lg font-semibold">AsistePro</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your workspace to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                defaultValue="sofia.ramirez@asistepro.io"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  defaultValue="demo-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border-border accent-primary"
                defaultChecked
              />
              Keep me signed in on this device
            </label>

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="relative my-1 text-center">
              <span className="relative z-10 bg-background px-3 text-xs text-muted-foreground">
                or continue with
              </span>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            </div>

            <Button type="button" variant="outline" className="w-full">
              <span className="font-mono text-xs">SSO</span>
              Single sign-on
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to AsistePro?{' '}
            <Link href="#" className="font-medium text-primary hover:underline">
              Start a free trial
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
