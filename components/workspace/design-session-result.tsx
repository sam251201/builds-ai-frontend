'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FurnitureCard } from './furniture-card'
import { BudgetDashboard } from '@/components/result/budget-dashboard'
import { LayoutValidationCard } from '@/components/result/layout-validation-card'
import { BOQTable } from '@/components/result/boq-table'
import { SectionHeading } from './section-heading'
import { WorkspaceTip } from './workspace-tip'
import type { AlternativeView, DesignSessionView, Furniture } from '@/lib/types'
import {
  changeBadgeForItem,
  type RedesignHighlight,
} from '@/lib/redesign-diff'
import { ArrowRightLeft, Sparkles, X } from 'lucide-react'

interface DesignSessionResultProps {
  session: DesignSessionView
  lastChange?: RedesignHighlight | null
  isUpdating?: boolean
  onRefine: (message: string) => Promise<void> | void
  onFinalize: () => Promise<void> | void
  onRestore: (versionNumber: number) => Promise<void> | void
  onCompareVersions: (versionA: number, versionB: number) => Promise<void> | void
  onDismissChange?: () => void
  onReset?: () => void
}

const ACTION_TIPS: Record<string, string> = {
  'view alternatives': 'Explore similar products that match your room, style and budget.',
  'explain this choice':
    'Understand why Builds selected this product and what trade-offs were considered.',
  'explain why we chose':
    'Understand why Builds selected this product and what trade-offs were considered.',
  'use this instead':
    'Replace the current product with this option. Your budget and layout will automatically update.',
  'compare products': 'Compare pricing, materials, dimensions and design suitability.',
  'compare designs': 'Compare pricing, materials, dimensions and design suitability.',
  'optimize budget': 'Find ways to reduce cost while preserving your preferred style.',
  'improve space': 'Adjust recommendations to create a more spacious layout.',
  'improve storage':
    'Suggest furniture that increases storage without overcrowding the room.',
  'finalize design': 'Lock this version and generate your final design report.',
  restore: 'Return to this version and continue refining from here.',
  compare: 'Select two design versions to see what changed between them.',
}

function tipFor(label: string): string {
  const lower = label.toLowerCase()
  for (const [key, value] of Object.entries(ACTION_TIPS)) {
    if (lower.includes(key)) return value
  }
  if (lower.startsWith('replace')) {
    return 'Swap this category for a better-fitting option without redesigning the whole room.'
  }
  if (lower.startsWith('show alternatives')) {
    return ACTION_TIPS['view alternatives']
  }
  return 'Apply this suggestion to continue refining your design with Builds.'
}

function shortBlurb(item: Furniture, reasons: string[]) {
  return (
    reasons[0] ||
    item.reasonForSelection ||
    `A thoughtful ${item.category.toLowerCase()} pick for your ${item.style} direction.`
  )
}

function buildDesignSummary(
  session: DesignSessionView,
  selectedExplanations: DesignSessionView['decisionExplanations']
): { summary: string; bullets: string[] } {
  if (session.designRationale?.summary) {
    const bullets = (session.designRationale.highlights || [])
      .filter((h) => h.why)
      .map((h) => `${h.name}: ${h.why}`)
    return {
      summary: session.designRationale.summary,
      bullets: bullets.slice(0, 8),
    }
  }

  const names = session.furnitureItems.map((item) => item.name)
  const within = session.withinBudget
  const layoutOk = session.layoutStatus === 'PASS'
  const summary = [
    `We put together a ${session.style.toLowerCase()} ${session.roomType.toLowerCase()} with ${session.furnitureItems.length} pieces`,
    within
      ? `staying within your ₹${session.budget.toLocaleString('en-IN')} budget`
      : `at ₹${session.totalPrice.toLocaleString('en-IN')} against your ₹${session.budget.toLocaleString('en-IN')} budget`,
    layoutOk
      ? 'while keeping comfortable walking space.'
      : '— layout is a bit tight, so we can free space if you want.',
  ].join(' ')

  const bullets: string[] = []
  for (const item of selectedExplanations.slice(0, 4)) {
    const reason = item.reasons?.[0]
    if (reason) {
      bullets.push(`${item.name}: ${reason}`)
    }
  }
  if (bullets.length === 0 && names.length > 0) {
    bullets.push(`Key pieces: ${names.slice(0, 4).join(', ')}.`)
  }
  return { summary, bullets: bullets.slice(0, 4) }
}

export function DesignSessionResult({
  session,
  lastChange = null,
  isUpdating = false,
  onRefine,
  onFinalize,
  onRestore,
  onCompareVersions,
  onDismissChange,
  onReset,
}: DesignSessionResultProps) {
  const [message, setMessage] = useState('')
  const [altsCategory, setAltsCategory] = useState<string | null>(null)
  const [comparePick, setComparePick] = useState<number | null>(null)
  const isCompleted = session.status === 'COMPLETED'
  const canRefine = !isCompleted && !session.refinementsLocked

  const boqItems = session.furnitureItems.map((item) => ({
    name: item.name,
    quantity: 1,
    unitPrice: item.price,
  }))

  const selectedExplanations = session.decisionExplanations.filter(
    (item) => item.outcome === 'selected'
  )

  const explanationByItem = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const item of selectedExplanations) {
      map[item.itemId] = item.reasons
    }
    return map
  }, [selectedExplanations])

  const { summary: designSummary, bullets: summaryBullets } = useMemo(
    () => buildDesignSummary(session, selectedExplanations),
    [session, selectedExplanations]
  )

  const rationaleByItem = useMemo(() => {
    const map: Record<string, string> = {}
    for (const highlight of session.designRationale?.highlights || []) {
      if (highlight.itemId && highlight.why) {
        map[highlight.itemId] = highlight.why
      }
    }
    return map
  }, [session.designRationale])

  const handleSubmit = async () => {
    const text = message.trim()
    if (!text || isUpdating || !canRefine) return
    setMessage('')
    await onRefine(text)
  }

  const handleCompareClick = async (versionNumber: number) => {
    if (comparePick === null) {
      setComparePick(versionNumber)
      return
    }
    if (comparePick === versionNumber) {
      setComparePick(null)
      return
    }
    const a = Math.min(comparePick, versionNumber)
    const b = Math.max(comparePick, versionNumber)
    setComparePick(null)
    await onCompareVersions(a, b)
  }

  const openAlts = altsCategory
    ? (session.alternatives[altsCategory] as AlternativeView[] | undefined) || []
    : []

  return (
    <div className="result-enter space-y-10">
      <header className="workspace-card space-y-3 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A44F]">
              Your room design
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#1F1F1F]">
              {session.style} {session.roomType}
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-[#6B6B6B]">
              {session.summary}
            </p>
          </div>
          <div className="rounded-full border border-[#EFE6D5] bg-[#FFF8EC] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#BE8D2F]">
            {session.status}
            {session.currentVersion
              ? ` · Design ${session.currentVersion}/${session.maxVersions}`
              : null}
          </div>
        </div>
      </header>

      {lastChange ? (
        <section className="relative overflow-hidden rounded-[18px] border border-[#D4A44F]/45 bg-gradient-to-br from-[#FFF8EC] via-[#FCFAF7] to-[#FFF2D9] p-6 shadow-[0_16px_40px_-28px_rgba(190,141,47,0.55)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#BE8D2F]">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                What changed
                {lastChange.fromVersion !== lastChange.toVersion
                  ? ` · Design ${lastChange.fromVersion} → ${lastChange.toVersion}`
                  : null}
              </p>
              <h3 className="font-display text-xl font-bold text-[#1F1F1F]">
                {lastChange.headline}
              </h3>
              {lastChange.userRequest ? (
                <p className="text-sm text-[#6B6B6B]">
                  Your request: “{lastChange.userRequest}”
                </p>
              ) : null}
            </div>
            {onDismissChange ? (
              <button
                type="button"
                onClick={onDismissChange}
                className="rounded-full p-1.5 text-[#6B6B6B] transition hover:bg-white hover:text-[#1F1F1F]"
                aria-label="Dismiss change highlight"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {lastChange.budgetDelta !== 0 ? (
              <span className="rounded-full border border-[#EFE6D5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1F1F]">
                Budget {lastChange.budgetDelta > 0 ? '+' : '−'}₹
                {Math.abs(lastChange.budgetDelta).toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="rounded-full border border-[#EFE6D5] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B6B6B]">
                Budget unchanged
              </span>
            )}
            {lastChange.layoutBefore &&
            lastChange.layoutAfter &&
            lastChange.layoutBefore !== lastChange.layoutAfter ? (
              <span className="rounded-full border border-[#EFE6D5] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1F1F]">
                Layout {lastChange.layoutBefore} → {lastChange.layoutAfter}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {lastChange.productsReplaced.length > 0 ? (
              <div className="rounded-2xl border border-[#EFE6D5] bg-white/80 p-3.5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#BE8D2F]">
                  Replaced
                </p>
                <ul className="space-y-1.5 text-sm text-[#1F1F1F]">
                  {lastChange.productsReplaced.map((item) => (
                    <li key={item.id}>
                      <span className="text-[#6B6B6B]">{item.category}: </span>
                      {item.previousName} → <strong>{item.name}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lastChange.productsAdded.length > 0 ? (
              <div className="rounded-2xl border border-[#EFE6D5] bg-white/80 p-3.5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#4F8A5B]">
                  Added
                </p>
                <ul className="space-y-1.5 text-sm text-[#1F1F1F]">
                  {lastChange.productsAdded.map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong>
                      <span className="text-[#6B6B6B]"> · {item.category}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {lastChange.productsRemoved.length > 0 ? (
              <div className="rounded-2xl border border-[#EFE6D5] bg-white/80 p-3.5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#C65B5B]">
                  Removed
                </p>
                <ul className="space-y-1.5 text-sm text-[#1F1F1F]">
                  {lastChange.productsRemoved.map((item) => (
                    <li key={item.id}>
                      {item.name}
                      <span className="text-[#6B6B6B]"> · {item.category}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {session.warnings.length > 0 ? (
        <div className="rounded-[18px] border border-[#E8D4A8] bg-[#FFF8EC] p-4 text-[15px] text-[#8A6A1E]">
          {session.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}

      {session.refinementsLocked && !isCompleted ? (
        <div className="rounded-[18px] border border-[#EFE6D5] bg-white p-5 text-[15px] leading-relaxed text-[#1F1F1F] shadow-sm">
          You&apos;ve reached the maximum number of design iterations for this session.
          Please finalize one of the existing designs or start a new design.
        </div>
      ) : null}

      {session.explanationText ? (
        <section className="workspace-card-secondary p-6">
          <SectionHeading
            title={isCompleted ? 'Final design report' : 'Designer notes'}
            subtitle="A clear summary of what Builds recommends right now."
          />
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#1F1F1F]">
            {session.explanationText}
          </p>
        </section>
      ) : null}

      {/* Continue Designing — collaborative core */}
      {!isCompleted ? (
        <section
          id="tour-continue"
          className="workspace-card space-y-5 border-[#E8D4A8] p-7 shadow-[0_16px_40px_-28px_rgba(190,141,47,0.45)]"
        >
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A44F]">
              Collaborate
            </p>
            <h3 className="font-display text-2xl font-bold text-[#1F1F1F]">
              Continue Designing
            </h3>
            <p className="mt-1 text-[15px] text-[#6B6B6B]">
              What would you like to change?
            </p>
          </div>

          {session.suggestedActions.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B6B6B]">
                Suggested actions
              </p>
              <div className="flex flex-wrap gap-2.5">
                {session.suggestedActions.map((action) => {
                  const isFinalize = action.toLowerCase().includes('finalize')
                  return (
                    <WorkspaceTip key={action} label={tipFor(action)}>
                      <button
                        type="button"
                        className={isFinalize ? 'ws-chip ws-chip--primary' : 'ws-chip'}
                        disabled={
                          isUpdating ||
                          (isFinalize
                            ? false
                            : !canRefine && !action.toLowerCase().includes('compare'))
                        }
                        onClick={() => {
                          if (isFinalize) {
                            void onFinalize()
                            return
                          }
                          void onRefine(action)
                        }}
                      >
                        {action}
                      </button>
                    </WorkspaceTip>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Replace the bed, increase budget, remove wall art..."
              disabled={isUpdating || !canRefine}
              className="h-12 flex-1 rounded-[14px] border-[#EFE6D5] bg-[#FCFAF7] px-4 text-[15px] text-[#1F1F1F] shadow-none focus-visible:border-[#D4A44F] focus-visible:ring-[#D4A44F]/25"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleSubmit()
                }
              }}
            />
            <WorkspaceTip label="Apply your change to the current design session.">
              <Button
                type="button"
                className="ws-btn-primary h-12 min-w-[120px] px-6"
                disabled={isUpdating || !canRefine || !message.trim()}
                onClick={() => void handleSubmit()}
              >
                {isUpdating ? 'Updating…' : 'Apply'}
              </Button>
            </WorkspaceTip>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <WorkspaceTip label={tipFor('Finalize Design')}>
              <Button
                type="button"
                className="ws-btn-primary h-11 px-5"
                disabled={isUpdating}
                onClick={() => void onFinalize()}
              >
                Finalize Design
              </Button>
            </WorkspaceTip>
            {onReset ? (
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-[14px] text-[#6B6B6B] hover:bg-[#FFF2D9] hover:text-[#1F1F1F]"
                disabled={isUpdating}
                onClick={onReset}
              >
                Start over
              </Button>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="workspace-card space-y-4 p-7">
          <h3 className="font-display text-xl font-bold text-[#1F1F1F]">Design locked</h3>
          <p className="text-[15px] leading-relaxed text-[#6B6B6B]">
            This design is finalized. Review the report above or begin a fresh session.
          </p>
          {onReset ? (
            <Button type="button" className="ws-btn-primary h-11 px-5" onClick={onReset}>
              Start new design
            </Button>
          ) : null}
        </section>
      )}

      {/* Timeline */}
      {session.versions.length > 0 ? (
        <section id="tour-timeline">
          <SectionHeading
            title="Design Timeline"
            subtitle="Every meaningful change is saved so you can restore or compare."
            info="Track every major design version and restore previous ideas."
            action={
              comparePick !== null ? (
                <p className="text-sm text-[#BE8D2F]">
                  Select another design to compare with Design {comparePick}
                </p>
              ) : null
            }
          />
          <div className="ws-timeline space-y-4">
            {session.versions.map((version) => (
              <article
                key={version.versionNumber}
                className={`workspace-card relative p-5 ${
                  version.isCurrent ? 'ring-2 ring-[#D4A44F]/35' : ''
                }`}
              >
                <span
                  className={`ws-timeline-dot ${version.isCurrent ? '' : 'ws-timeline-dot--muted'}`}
                />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-lg font-bold text-[#1F1F1F]">
                        Design {version.versionNumber}
                      </h4>
                      {version.isCurrent ? (
                        <span className="ws-badge-success">Current</span>
                      ) : null}
                      {version.versionNumber === 1 ? (
                        <span className="rounded-full bg-[#FFF2D9] px-2.5 py-0.5 text-[11px] font-semibold text-[#BE8D2F]">
                          Original Design
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[15px] font-medium text-[#1F1F1F]">
                      {version.changeSummary}
                    </p>
                    <p className="text-sm text-[#6B6B6B]">
                      {version.timestamp
                        ? new Date(version.timestamp).toLocaleString()
                        : '—'}
                      {' · '}₹{version.budgetSpent.toLocaleString('en-IN')}
                      {' · '}Layout {version.layoutStatus}
                      {' · '}
                      {version.productCount} products
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <WorkspaceTip label={tipFor('Restore Design')}>
                      <Button
                        type="button"
                        size="sm"
                        className="ws-btn-secondary h-9 px-3"
                        disabled={isUpdating || version.isCurrent || isCompleted}
                        onClick={() => void onRestore(version.versionNumber)}
                      >
                        {version.isCurrent ? 'Viewing' : 'Restore'}
                      </Button>
                    </WorkspaceTip>
                    <WorkspaceTip label={tipFor('Compare')}>
                      <Button
                        type="button"
                        size="sm"
                        className="ws-btn-secondary h-9 px-3"
                        disabled={isUpdating}
                        onClick={() => void handleCompareClick(version.versionNumber)}
                      >
                        Compare
                      </Button>
                    </WorkspaceTip>
                    {!isCompleted ? (
                      <WorkspaceTip label={tipFor('Finalize Design')}>
                        <Button
                          type="button"
                          size="sm"
                          className="ws-btn-primary h-9 px-3"
                          disabled={isUpdating || !version.isCurrent}
                          onClick={() => void onFinalize()}
                        >
                          Finalize
                        </Button>
                      </WorkspaceTip>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {session.versionComparison ? (
        <section className="workspace-card-secondary space-y-3 p-6">
          <h3 className="font-display text-lg font-bold text-[#1F1F1F]">
            Design {session.versionComparison.versionA} vs Design{' '}
            {session.versionComparison.versionB}
          </h3>
          <p className="text-[15px] text-[#1F1F1F]">{session.versionComparison.summary}</p>
          <p className="text-sm text-[#6B6B6B]">
            Budget difference: ₹
            {session.versionComparison.budgetDifference.toLocaleString('en-IN')}
          </p>
          {session.versionComparison.styleDifference.changed ? (
            <p className="text-sm text-[#6B6B6B]">
              Style: {session.versionComparison.styleDifference.styleA} →{' '}
              {session.versionComparison.styleDifference.styleB}
            </p>
          ) : null}
          {session.versionComparison.productsAdded.length > 0 ? (
            <p className="text-sm text-[#6B6B6B]">
              Added:{' '}
              {session.versionComparison.productsAdded.map((p) => p.name).join(', ')}
            </p>
          ) : null}
          {session.versionComparison.productsRemoved.length > 0 ? (
            <p className="text-sm text-[#6B6B6B]">
              Removed:{' '}
              {session.versionComparison.productsRemoved.map((p) => p.name).join(', ')}
            </p>
          ) : null}
          {session.versionComparison.productsChanged.length > 0 ? (
            <ul className="space-y-1 text-sm text-[#6B6B6B]">
              {session.versionComparison.productsChanged.map((row, idx) => (
                <li key={`${row.from.id}-${row.to.id}-${idx}`}>
                  Changed{row.category ? ` ${row.category}` : ''}: {row.from.name} →{' '}
                  {row.to.name}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* Products */}
      <section id="tour-products">
        <SectionHeading
          title="Selected products"
          subtitle="Pieces chosen for your room, style, and budget."
          info="Learn why Builds recommended each product."
        />
        {session.furnitureItems.length > 0 ? (
          <>
            <div className="mb-6 workspace-card-secondary space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#BE8D2F]">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Why these pieces
                  </p>
                </div>
                {session.designRationale?.source === 'gemini' ? (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#BE8D2F]">
                    Designer note
                  </span>
                ) : null}
              </div>
              <p className="text-[15px] leading-relaxed text-[#1F1F1F]">
                {designSummary}
              </p>
              {summaryBullets.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[#6B6B6B]">
                  {summaryBullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {session.furnitureItems.map((item) => {
                const reasons = explanationByItem[item.id] || []
                const llmWhy = rationaleByItem[item.id]
                return (
                  <div key={item.id} className="space-y-3">
                    <FurnitureCard
                      furniture={item}
                      explanation={llmWhy || shortBlurb(item, reasons)}
                      changeBadge={changeBadgeForItem(item, lastChange)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <WorkspaceTip label={tipFor('View Alternatives')}>
                        <Button
                          type="button"
                          size="sm"
                          className="ws-btn-secondary h-9 px-3"
                          disabled={isUpdating || isCompleted}
                          onClick={() =>
                            setAltsCategory(
                              altsCategory === item.category ? null : item.category
                            )
                          }
                        >
                          View Alternatives
                        </Button>
                      </WorkspaceTip>
                      <WorkspaceTip label={tipFor('Explain This Choice')}>
                        <Button
                          type="button"
                          size="sm"
                          className="ws-btn-secondary h-9 px-3"
                          disabled={isUpdating || isCompleted}
                          onClick={() =>
                            void onRefine(`Explain why we chose the ${item.category}`)
                          }
                        >
                          Explain This Choice
                        </Button>
                      </WorkspaceTip>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <p className="text-[15px] text-[#6B6B6B]">No products selected yet.</p>
        )}
      </section>

      {/* Alternatives */}
      {altsCategory ? (
        <section id="tour-alternatives" className="space-y-5">
          <SectionHeading
            title={`Alternatives for ${altsCategory}`}
            subtitle="Similar pieces that still respect your room, style, and budget."
            info="Browse similar products that also fit your room."
            action={
              <Button
                type="button"
                variant="ghost"
                className="rounded-[14px] text-[#6B6B6B] hover:bg-[#FFF2D9]"
                onClick={() => setAltsCategory(null)}
              >
                Close
              </Button>
            }
          />
          {openAlts.length === 0 ? (
            <p className="text-[15px] text-[#6B6B6B]">No alternatives available yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {openAlts.map((alt) => (
                <article key={alt.product.id} className="workspace-card overflow-hidden">
                  <div className="ws-product-media flex h-28 items-center justify-center text-3xl">
                    ✨
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-display text-lg font-bold text-[#1F1F1F]">
                          {alt.product.name}
                        </h4>
                        <p className="text-sm text-[#6B6B6B]">{alt.product.category}</p>
                      </div>
                      <p className="font-bold text-[#BE8D2F]">
                        ₹{alt.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="text-sm text-[#6B6B6B]">
                      Budget difference:{' '}
                      <span className="font-semibold text-[#1F1F1F]">
                        ₹{alt.priceDifference.toLocaleString('en-IN')}
                      </span>
                      {alt.styleMatch ? ` · Style: ${alt.styleMatch}` : ''}
                      {alt.spaceMatch ? ` · Size: ${alt.spaceMatch}` : ''}
                    </p>
                    {alt.pros.length > 0 ? (
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#4F8A5B]">
                          Pros
                        </p>
                        <ul className="list-disc space-y-1 pl-4 text-sm text-[#6B6B6B]">
                          {alt.pros.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {alt.cons.length > 0 ? (
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#D79A2B]">
                          Things to consider
                        </p>
                        <ul className="list-disc space-y-1 pl-4 text-sm text-[#6B6B6B]">
                          {alt.cons.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {alt.reasonNotSelected ? (
                      <p className="text-sm leading-relaxed text-[#6B6B6B]">
                        Why it wasn&apos;t selected: {alt.reasonNotSelected}
                      </p>
                    ) : null}
                    <WorkspaceTip label={tipFor('Use This Instead')}>
                      <Button
                        type="button"
                        className="ws-btn-primary h-11 w-full"
                        disabled={isUpdating || !canRefine}
                        onClick={() =>
                          void onRefine(
                            `Replace ${altsCategory} with product ${alt.product.id}`
                          )
                        }
                      >
                        Use This Instead
                      </Button>
                    </WorkspaceTip>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {session.productComparison &&
      typeof session.productComparison === 'object' &&
      session.productComparison.found === true ? (
        <section className="workspace-card space-y-4 p-6">
          <SectionHeading
            title="Product comparison"
            subtitle="Side-by-side clarity on price, finish, and style."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {(['product_a', 'product_b'] as const).map((key) => {
              const product = session.productComparison?.[key] as
                | {
                    name?: string
                    price_inr?: number
                    style_tags?: string
                    color_finish?: string
                  }
                | undefined
              if (!product) return null
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-[#EFE6D5] bg-[#FFF8EC] p-4"
                >
                  <p className="font-display text-lg font-bold text-[#1F1F1F]">
                    {product.name}
                  </p>
                  <p className="mt-1 font-semibold text-[#BE8D2F]">
                    ₹{Number(product.price_inr || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="mt-2 text-sm text-[#6B6B6B]">
                    Style: {product.style_tags || '—'}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">
                    Finish: {product.color_finish || '—'}
                  </p>
                </div>
              )
            })}
          </div>
          {typeof session.productComparison.recommendation === 'string' ? (
            <p className="rounded-2xl bg-[#FFF2D9] px-4 py-3 text-[15px] text-[#1F1F1F]">
              <span className="font-semibold text-[#BE8D2F]">Recommendation · </span>
              {String(session.productComparison.recommendation)}
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <BudgetDashboard totalBudget={session.budget} spent={session.totalPrice} />
        <LayoutValidationCard
          roomArea={session.roomArea}
          furnitureArea={session.furnitureFootprint}
          walkingClearance={session.walkingSpace}
          status={session.layoutStatus === 'PASS' ? 'PASS' : 'REPLAN'}
        />
      </div>

      {boqItems.length > 0 ? (
        <section className="workspace-card p-6">
          <SectionHeading
            title="Bill of quantities"
            subtitle="A clean list of selected pieces and pricing."
          />
          <BOQTable items={boqItems} />
        </section>
      ) : null}
    </div>
  )
}
