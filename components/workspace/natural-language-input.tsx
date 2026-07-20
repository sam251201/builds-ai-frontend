'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CircleDollarSign, ScanSearch, Sofa, Sparkles, WandSparkles } from 'lucide-react'

interface NaturalLanguageInputProps {
  onSubmit: (text: string) => void
  isLoading?: boolean
}

export function NaturalLanguageInput({
  onSubmit,
  isLoading = false,
}: NaturalLanguageInputProps) {
  const [text, setText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const examples = [
    '🏡 Cozy Scandinavian Living Room',
    '🛏 Modern Master Bedroom',
    '🍽 Luxury Dining Room',
    '👨‍👩‍👧 Family Friendly Living Room',
  ]
  const placeholders = [
    'A 4.8m × 3.6m living room, warm Scandinavian style, ₹2.5 lakh budget, with a deep sofa and reading chair...',
    'Design a serene modern bedroom under ₹1.8 lakh with a king bed, soft lighting and hidden storage...',
    'Create an elegant dining room for six in a contemporary style, budget ₹3 lakh, with a statement pendant...',
    'A family-friendly lounge with durable fabrics, lots of storage and natural light, around ₹2 lakh...',
  ]

  useEffect(() => {
    const timer = window.setInterval(
      () => setPlaceholderIndex((current) => (current + 1) % placeholders.length),
      4000
    )
    return () => window.clearInterval(timer)
  }, [placeholders.length])

  const detected = useMemo(() => {
    const value = text.toLowerCase()
    const find = (values: string[]) => values.find((item) => value.includes(item.toLowerCase()))
    const room = find(['Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Lounge', 'Nursery'])
    const style = find(['Scandinavian', 'Modern', 'Minimalist', 'Contemporary', 'Mid-Century', 'Industrial', 'Bohemian'])
    const budgetMatch = text.match(/(?:₹|rs\.?|inr)\s?([\d,.]+)\s*(lakh|lac|k)?/i)
    const furniture = ['sofa', 'sectional', 'chair', 'bed', 'desk', 'table', 'storage', 'bookshelf', 'wardrobe', 'ottoman']
      .filter((item) => value.includes(item))
      .slice(0, 3)
    const budget = budgetMatch
      ? `${budgetMatch[1]}${budgetMatch[2] ? ` ${budgetMatch[2]}` : ''}`
      : undefined
    return [
      room && { label: room, icon: ScanSearch },
      style && { label: style, icon: Sparkles },
      budget && { label: `₹${budget}`, icon: CircleDollarSign },
      furniture.length > 0 && { label: furniture.join(', '), icon: Sofa },
    ].filter(Boolean) as { label: string; icon: typeof ScanSearch }[]
  }, [text])

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text)
      setText('')
    }
  }

  const handleExampleClick = (example: string) => {
    setText(example)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!e.nativeEvent.isComposing) {
        e.preventDefault()
        handleSubmit()
      }
    }
  }

  return (
    <div className="workspace-card space-y-5 p-5">
      <div>
        <label className="mb-2 block font-display text-lg font-bold text-[#1F1F1F]">
          Tell Builds About Your Space
        </label>
        <div className={`intelligent-input ${text ? 'is-thinking' : ''}`}>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[placeholderIndex]}
            className="min-h-40 resize-none rounded-[14px] border-[#EFE6D5] bg-[#FCFAF7] pr-10 text-[15px]"
            disabled={isLoading}
          />
          <WandSparkles className="input-spark h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-h-12 pt-3" aria-live="polite">
          {text && (
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
              <span className="agent-listening-dot" />
              Builds is understanding your brief
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {detected.map(({ label, icon: Icon }) => (
              <span className="detected-chip" key={label}>
                <Icon className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-3 font-light">
          Not sure? Pick an example or just describe your ideal room:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {examples.map((example) => (
            <Button
              key={example}
              onClick={() => handleExampleClick(example)}
              variant="outline"
              className="text-xs h-auto py-2 px-3 text-left font-light border-border hover:border-accent hover:bg-white"
              data-magnetic
              disabled={isLoading}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="ws-btn-primary premium-button h-12 w-full text-base"
        data-magnetic
      >
        {isLoading ? 'Designing…' : 'Design My Room'}
      </Button>

      <p className="text-center text-xs font-medium text-[#6B6B6B]">
        No forms required. Builds understands natural language.
      </p>
    </div>
  )
}
