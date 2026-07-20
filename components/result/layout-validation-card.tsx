'use client'

import { Footprints, LayoutGrid, CheckCircle2, AlertTriangle } from 'lucide-react'
import { SectionHeading } from '@/components/workspace/section-heading'

interface LayoutValidationCardProps {
  roomArea: number
  furnitureArea: number
  walkingClearance: number
  status?: 'PASS' | 'REPLAN'
}

export function LayoutValidationCard({
  roomArea,
  furnitureArea,
  walkingClearance,
  status,
}: LayoutValidationCardProps) {
  const occupancy = roomArea > 0 ? (furnitureArea / roomArea) * 100 : 0
  const healthy = status === 'PASS'

  return (
    <div className="workspace-card p-6">
      <SectionHeading
        title="Layout"
        subtitle="Whether the furniture still leaves room to move."
        info="Shows whether your selected furniture comfortably fits inside your room."
        className="mb-4"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {healthy ? (
          <span className="ws-badge-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Comfortable fit
          </span>
        ) : (
          <span className="ws-badge-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            Feels tight
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#EFE6D5] bg-[#FFF8EC] p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[#D4A44F]">
            <LayoutGrid className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Density</span>
          </div>
          <p className="text-lg font-bold text-[#1F1F1F]">{occupancy.toFixed(0)}%</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">Furniture footprint</p>
        </div>
        <div className="rounded-2xl border border-[#EFE6D5] bg-[#FFF8EC] p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[#D4A44F]">
            <Footprints className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Walking</span>
          </div>
          <p className="text-lg font-bold text-[#1F1F1F]">{walkingClearance.toFixed(1)} m²</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">Open circulation</p>
        </div>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-[#6B6B6B]">
        {healthy
          ? 'There’s enough clear floor so the room feels open and easy to move through.'
          : 'Furniture is taking more of the floor than ideal — we can free up space if you’d like.'}
      </p>
    </div>
  )
}
