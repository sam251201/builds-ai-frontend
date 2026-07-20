'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface WorkspaceTipProps {
  label: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/** Warm ivory tooltip with 300ms delay — workspace only. */
export function WorkspaceTip({ label, children, side = 'top' }: WorkspaceTipProps) {
  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger className="inline-flex cursor-pointer border-0 bg-transparent p-0">
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={8}
          className="workspace-tooltip max-w-[240px] border border-[#EFE6D5] bg-[#FCFAF7] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#1F1F1F] shadow-[0_12px_32px_-16px_rgba(80,60,20,0.35)] [&_[data-slot=tooltip-content]]:bg-[#FCFAF7]"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
