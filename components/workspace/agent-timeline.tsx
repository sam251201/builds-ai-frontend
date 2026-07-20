'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { DESIGN_GENERATION_STEPS } from '@/lib/mock-design-steps'
import { createDesign, mapDesignResponse } from '@/lib/api'
import type { CustomerBrief as CustomerBriefType, DesignStep, DesignRecommendation } from '@/lib/types'

interface AgentTimelineProps {
  brief: CustomerBriefType
  onComplete: (design: DesignRecommendation) => void
}

export function AgentTimeline({ brief, onComplete }: AgentTimelineProps) {
  const [steps, setSteps] = useState<DesignStep[]>(
    DESIGN_GENERATION_STEPS.map((step) => ({ ...step, status: 'pending' }))
  )
  const [activeMessage, setActiveMessage] = useState('Understanding your brief...')
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const briefRef = useRef(brief)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    briefRef.current = brief
  }, [brief])

  const liveMessages = [
    'Understanding your brief...',
    'Searching catalogue...',
    'Matching style tags...',
    'Checking dimensions...',
    'Validating budget...',
    'Optimizing selection...',
    'Preparing proposal...',
  ]

  const runTimeline = async () => {
    setError(null)
    setIsRetrying(false)
    setSteps(DESIGN_GENERATION_STEPS.map((step) => ({ ...step, status: 'pending' })))
    setActiveMessage(liveMessages[0])

    const designPromise = createDesign(briefRef.current)
      .then(mapDesignResponse)
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Could not reach the design API'
        throw new Error(message)
      })

    for (let index = 0; index < DESIGN_GENERATION_STEPS.length; index += 1) {
      setActiveMessage(liveMessages[index] || DESIGN_GENERATION_STEPS[index].title)
      setSteps((prev) =>
        prev.map((step, i) => {
          if (i < index) return { ...step, status: 'completed' }
          if (i === index) return { ...step, status: 'in-progress' }
          return { ...step, status: 'pending' }
        })
      )

      await new Promise((resolve) => setTimeout(resolve, 700))

      setSteps((prev) =>
        prev.map((step, i) =>
          i <= index ? { ...step, status: 'completed' } : step
        )
      )
    }

    try {
      const design = await designPromise
      setActiveMessage('Design ready')
      onCompleteRef.current(design)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Design request failed'
      setError(message)
      setActiveMessage('Something went wrong')
    }
  }

  useEffect(() => {
    void runTimeline()
    // Run once per mount / brief submission instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <Card className="premium-card glass-reflection p-8 bg-accent/5 border-border">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Builds Agent</p>
            <h3 className="text-lg font-semibold text-foreground">{activeMessage}</h3>
          </div>
          <div className="agent-orb" aria-hidden="true"><span /></div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className={`timeline-step flex gap-4 ${step.status}`}>
              <div className="flex-shrink-0 pt-1">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : step.status === 'in-progress' ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-grow pt-0.5">
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-600/80">
              Make sure the FastAPI server is running on {process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}.
            </p>
            <Button
              size="sm"
              variant="outline"
              disabled={isRetrying}
              onClick={() => {
                setIsRetrying(true)
                void runTimeline()
              }}
            >
              Retry
            </Button>
          </div>
        )}
      </Card>

      {!error && (
        <div className="proposal-skeleton rounded-xl border border-border bg-card p-5" aria-label="Preparing proposal preview">
          <div className="skeleton-line w-2/5" />
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="skeleton-block" />
            <div className="skeleton-block" />
          </div>
          <div className="mt-4 skeleton-line w-4/5" />
          <div className="mt-2 skeleton-line w-3/5" />
        </div>
      )}
    </div>
  )
}
