'use client'

import { CheckCircle2, Circle } from 'lucide-react'

interface AgentStepperProps {
  currentStep: number
  totalSteps?: number
}

export function AgentStepper({ currentStep, totalSteps = 5 }: AgentStepperProps) {
  const steps = [
    'Understand Room',
    'Search Catalogue',
    'Validate Budget',
    'Validate Layout',
    'Final Proposal',
  ]

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isPending = stepNumber > currentStep

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {isCompleted ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-accent bg-accent/10 animate-pulse`}>
                    <span className="text-xs font-bold text-accent">{stepNumber}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-border bg-white">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {stepNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCompleted
                      ? 'text-accent'
                      : isCurrent
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step}
                </p>
              </div>

              {isCurrent && (
                <div className="text-xs text-accent font-semibold animate-pulse">
                  Working...
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
