'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'

interface TransitionScreenProps {
  onComplete?: () => void
}

export function TransitionScreen({ onComplete }: TransitionScreenProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const steps = [
    'Understanding your room...',
    'Finding furniture...',
    'Checking layouts...',
    'Calculating budget...',
    'Designing your room...',
  ]

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(step + 1)
      }, 400)
      return () => clearTimeout(timer)
    } else {
      setIsComplete(true)
      const redirectTimer = setTimeout(() => {
        onComplete?.()
        router.replace('/workspace')
      }, 800)
      return () => clearTimeout(redirectTimer)
    }
  }, [step, onComplete, router])

  if (!mounted) return null

  return createPortal(
    <div className={`workspace-loader bg-[#111]/65 backdrop-blur-xl z-[100] ${isComplete ? 'is-complete' : ''}`}>
      <div className="loader-aurora" aria-hidden="true" />
      <Card className="glass-reflection relative my-auto w-full max-w-md shrink-0 p-6 sm:p-8 space-y-5 border-white/20 bg-white/95 shadow-2xl max-h-[min(90dvh,40rem)] overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="agent-orb mx-auto mb-4" aria-hidden="true"><span /></div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Builds is readying your studio
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light">
            Intelligence, catalogue and spatial tools
          </p>
        </div>

        <div className="space-y-2.5">
          {steps.map((stepText, index) => (
            <div
              key={index}
              className={`text-sm font-light transition-all duration-300 ${
                index < step
                  ? 'text-accent opacity-60'
                  : index === step
                    ? 'text-foreground opacity-100 animate-pulse'
                    : 'text-muted-foreground opacity-30'
              }`}
            >
              {stepText}
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index < step
                    ? 'w-6 bg-accent'
                    : index === step
                      ? 'w-4 bg-accent/50 animate-pulse'
                      : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {isComplete && (
          <div className="text-center pt-2 animate-fade-in">
            <p className="text-sm text-accent font-semibold">
              Ready to design
            </p>
          </div>
        )}
      </Card>
    </div>,
    document.body,
  )
}
