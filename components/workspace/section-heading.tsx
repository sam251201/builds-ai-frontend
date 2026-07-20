'use client'

import { Info } from 'lucide-react'
import { WorkspaceTip } from './workspace-tip'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  info?: string
  className?: string
  action?: React.ReactNode
  id?: string
}

export function SectionHeading({
  title,
  subtitle,
  info,
  className,
  action,
  id,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn('mb-5 flex flex-wrap items-start justify-between gap-3', className)}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl font-bold tracking-tight text-[#1F1F1F]">
            {title}
          </h3>
          {info ? (
            <WorkspaceTip label={info} side="right">
              <button
                type="button"
                aria-label={`About ${title}`}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#EFE6D5] bg-[#FFF8EC] text-[#D4A44F] transition-all duration-200 hover:scale-105 hover:border-[#D4A44F] hover:bg-[#D4A44F] hover:text-white"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </WorkspaceTip>
          ) : null}
        </div>
        {subtitle ? (
          <p className="max-w-xl text-[15px] font-medium leading-relaxed text-[#6B6B6B]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
