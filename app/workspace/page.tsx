'use client'

import { useRef, useState } from 'react'
import { InputModeToggle } from '@/components/workspace/input-mode-toggle'
import { NaturalLanguageInput } from '@/components/workspace/natural-language-input'
import { RightPanelWelcome } from '@/components/workspace/right-panel-welcome'
import { CustomerBrief } from '@/components/workspace/customer-brief'
import { DesignSessionResult } from '@/components/workspace/design-session-result'
import {
  WorkspaceHelpButton,
  WorkspaceTour,
} from '@/components/workspace/workspace-tour'
import {
  compareDesignVersions,
  finalizeDesignSession,
  mapSessionResponse,
  restoreDesignVersion,
  startDesignSession,
  updateDesignSession,
} from '@/lib/api'
import { computeRedesignHighlight, type RedesignHighlight } from '@/lib/redesign-diff'
import type { CustomerBrief as CustomerBriefType, DesignSessionView } from '@/lib/types'
import { Loader2, Sparkles } from 'lucide-react'

export default function WorkspacePage() {
  const [inputMode, setInputMode] = useState<'natural' | 'structured'>('structured')
  const [, setBrief] = useState<CustomerBriefType | null>(null)
  const [session, setSession] = useState<DesignSessionView | null>(null)
  const [lastChange, setLastChange] = useState<RedesignHighlight | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forceTour, setForceTour] = useState(false)
  const previousSessionRef = useRef<DesignSessionView | null>(null)

  const applySession = (
    next: DesignSessionView,
    options?: { trackChange?: boolean; clearChange?: boolean }
  ) => {
    if (options?.clearChange) {
      setLastChange(null)
    } else if (options?.trackChange) {
      setLastChange(computeRedesignHighlight(previousSessionRef.current, next))
    }
    previousSessionRef.current = next
    setSession(next)
  }

  const handleNaturalLanguageSubmit = (text: string) => {
    const parsedBrief: CustomerBriefType = {
      roomType: 'Living Room',
      roomLength: 400,
      roomWidth: 350,
      ceilingHeight: 280,
      budget: 150000,
      interiorStyle: 'Scandinavian',
      mustHaveItems: text.split(/,| and /i).map((item) => item.trim()).filter(Boolean),
      additionalNotes: text,
    }
    void startSession(parsedBrief)
  }

  const startSession = async (customerBrief: CustomerBriefType) => {
    setBrief(customerBrief)
    setIsGenerating(true)
    setError(null)
    setSession(null)
    setLastChange(null)
    previousSessionRef.current = null
    try {
      const response = await startDesignSession(customerBrief)
      applySession(mapSessionResponse(response), { clearChange: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start design session')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefine = async (message: string) => {
    if (!session?.sessionId) return
    setIsUpdating(true)
    setError(null)
    try {
      const response = await updateDesignSession(session.sessionId, message)
      applySession(mapSessionResponse(response), { trackChange: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update design')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFinalize = async () => {
    if (!session?.sessionId) return
    setIsUpdating(true)
    setError(null)
    try {
      const response = await finalizeDesignSession(session.sessionId)
      applySession(mapSessionResponse(response), { trackChange: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize design')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRestore = async (versionNumber: number) => {
    if (!session?.sessionId) return
    setIsUpdating(true)
    setError(null)
    try {
      const response = await restoreDesignVersion(session.sessionId, versionNumber)
      applySession(mapSessionResponse(response), { trackChange: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore design')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCompareVersions = async (versionA: number, versionB: number) => {
    if (!session?.sessionId) return
    setIsUpdating(true)
    setError(null)
    try {
      const response = await compareDesignVersions(session.sessionId, versionA, versionB)
      applySession(mapSessionResponse(response), { trackChange: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare designs')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReset = () => {
    setSession(null)
    setBrief(null)
    setError(null)
    setLastChange(null)
    previousSessionRef.current = null
  }

  return (
    <div className="workspace-shell page-enter">
      <WorkspaceTour
        forceOpen={forceTour}
        onCloseForce={() => setForceTour(false)}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EFE6D5] bg-white/80 px-3.5 py-1.5 text-xs font-semibold tracking-[0.16em] text-[#BE8D2F] shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              BUILDS STUDIO
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[#1F1F1F]">
              Design with Builds
            </h1>
            <p className="max-w-xl text-[16px] leading-relaxed text-[#6B6B6B]">
              Share your room brief, then refine collaboratively — like working with an
              interior designer who remembers every decision.
            </p>
          </div>
          <WorkspaceHelpButton onClick={() => setForceTour(true)} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1" data-reveal>
            <div className="sticky top-24 space-y-6">
              <InputModeToggle mode={inputMode} onChange={setInputMode} />
              {inputMode === 'natural' ? (
                <NaturalLanguageInput
                  onSubmit={handleNaturalLanguageSubmit}
                  isLoading={isGenerating || isUpdating}
                />
              ) : (
                <CustomerBrief
                  onGenerate={(nextBrief) => void startSession(nextBrief)}
                  isLoading={isGenerating || isUpdating}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-2" data-reveal>
            {error ? (
              <div className="mb-5 rounded-[18px] border border-[#E8B4B4] bg-[#FDF2F2] p-4 text-[15px] text-[#C65B5B]">
                {error}
              </div>
            ) : null}

            {isGenerating ? (
              <div className="workspace-card flex flex-col items-center justify-center gap-4 p-14 text-center">
                <div className="agent-orb">
                  <span />
                </div>
                <div className="flex items-center gap-2 text-[#BE8D2F]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-semibold tracking-wide">
                    Composing your room…
                  </span>
                </div>
                <p className="max-w-sm text-[15px] leading-relaxed text-[#6B6B6B]">
                  Builds is selecting pieces from the catalog that fit your style, budget,
                  and room proportions.
                </p>
              </div>
            ) : session ? (
              <DesignSessionResult
                session={session}
                lastChange={lastChange}
                isUpdating={isUpdating}
                onRefine={handleRefine}
                onFinalize={handleFinalize}
                onRestore={handleRestore}
                onCompareVersions={handleCompareVersions}
                onDismissChange={() => setLastChange(null)}
                onReset={handleReset}
              />
            ) : (
              <RightPanelWelcome />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
