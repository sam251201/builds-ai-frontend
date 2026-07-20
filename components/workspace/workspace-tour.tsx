'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle, Sparkles, X } from 'lucide-react'

const STORAGE_KEY = 'builds-workspace-tour-done'

const STEPS = [
  {
    title: 'Continue Designing',
    body: 'Tell Builds what you’d like to change — swap a piece, adjust budget, or refine the feel of the room.',
  },
  {
    title: 'Product Cards',
    body: 'Review why each product was selected, how it fits your room, and what trade-offs we considered.',
  },
  {
    title: 'View Alternatives',
    body: 'Swap products without redesigning the whole room. Budget and layout update automatically.',
  },
  {
    title: 'Design Timeline',
    body: 'Every important design iteration is saved here. Restore, compare, or finalize any version.',
  },
  {
    title: 'Finalize Design',
    body: 'Lock your favorite design and generate your final design report when you’re ready.',
  },
]

interface WorkspaceTourProps {
  forceOpen?: boolean
  onCloseForce?: () => void
}

export function WorkspaceTour({ forceOpen = false, onCloseForce }: WorkspaceTourProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (forceOpen) {
      setStep(0)
      setOpen(true)
      return
    }
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [forceOpen])

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
    setOpen(false)
    onCloseForce?.()
  }

  if (!open) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1F1F1F]/25 p-4 backdrop-blur-[2px] sm:items-center">
      <div className="workspace-card w-full max-w-md animate-[result-enter_420ms_cubic-bezier(.22,1,.36,1)] p-6 shadow-[0_28px_60px_-28px_rgba(50,40,10,0.45)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#D4A44F]">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Quick tour · {step + 1}/{STEPS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={finish}
            className="rounded-full p-1.5 text-[#6B6B6B] transition hover:bg-[#FFF2D9] hover:text-[#1F1F1F]"
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="font-display text-2xl font-bold text-[#1F1F1F]">{current.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6B6B6B]">{current.body}</p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            className="text-sm font-medium text-[#6B6B6B] transition hover:text-[#1F1F1F]"
            onClick={finish}
          >
            Skip
          </button>
          <div className="flex gap-2">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="ws-btn-secondary"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              className="ws-btn-primary"
              onClick={() => {
                if (isLast) finish()
                else setStep((s) => s + 1)
              }}
            >
              {isLast ? 'Start designing' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WorkspaceHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#EFE6D5] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B6B6B] shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-[#D4A44F] hover:bg-[#FFF8EC] hover:text-[#BE8D2F]"
    >
      <HelpCircle className="h-3.5 w-3.5" />
      Help
    </button>
  )
}
