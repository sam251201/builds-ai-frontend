'use client'

import { Sparkles, ArrowRight } from 'lucide-react'

export function RightPanelWelcome() {
  return (
    <div className="workspace-card flex min-h-[420px] flex-col items-center justify-center p-10 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF2D9] text-[#D4A44F] shadow-inner">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight text-[#1F1F1F]">
        Your design canvas
      </h2>
      <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6B6B6B]">
        Start with a room brief on the left. Builds will compose a first design, then stay
        with you through refinements until you finalize.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-[#BE8D2F]">
        <span className="rounded-full border border-[#EFE6D5] bg-[#FFF8EC] px-3 py-1.5 font-medium">
          Style-aware
        </span>
        <span className="rounded-full border border-[#EFE6D5] bg-[#FFF8EC] px-3 py-1.5 font-medium">
          Budget-safe
        </span>
        <span className="rounded-full border border-[#EFE6D5] bg-[#FFF8EC] px-3 py-1.5 font-medium">
          Space-validated
        </span>
      </div>
      <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B6B6B]">
        Complete the brief to begin
        <ArrowRight className="h-4 w-4 text-[#D4A44F]" />
      </p>
    </div>
  )
}
