'use client'

import dynamic from 'next/dynamic'
import type { Branch } from '@/lib/data'

const BranchMap = dynamic(
  () => import('@/components/branch-map').then((m) => m.BranchMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  },
)

export function BranchMapClient({
  branches,
  height,
}: {
  branches: Branch[]
  height?: number
}) {
  return <BranchMap branches={branches} height={height} />
}
