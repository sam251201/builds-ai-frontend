'use client'

import { Button } from '@/components/ui/button'

interface InputModeToggleProps {
  mode: 'natural' | 'structured'
  onChange: (mode: 'natural' | 'structured') => void
}

export function InputModeToggle({ mode, onChange }: InputModeToggleProps) {
  return (
    <div className="flex gap-1.5 rounded-2xl border border-[#EFE6D5] bg-[#FFF8EC] p-1.5">
      <Button
        onClick={() => onChange('structured')}
        variant="ghost"
        className={`h-10 flex-1 rounded-[12px] font-semibold transition-all duration-200 ${
          mode === 'structured'
            ? 'bg-[#D4A44F] text-white shadow-sm hover:bg-[#BE8D2F] hover:text-white'
            : 'text-[#6B6B6B] hover:bg-white hover:text-[#1F1F1F]'
        }`}
      >
        Structured brief
      </Button>
      <Button
        onClick={() => onChange('natural')}
        variant="ghost"
        className={`h-10 flex-1 rounded-[12px] font-semibold transition-all duration-200 ${
          mode === 'natural'
            ? 'bg-[#D4A44F] text-white shadow-sm hover:bg-[#BE8D2F] hover:text-white'
            : 'text-[#6B6B6B] hover:bg-white hover:text-[#1F1F1F]'
        }`}
      >
        Free text
      </Button>
    </div>
  )
}
