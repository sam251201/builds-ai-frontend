'use client'

import type { Furniture } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FurnitureCardProps {
  furniture: Furniture
  explanation?: string
  changeBadge?: 'added' | 'updated' | null
}

const CATEGORY_MOTIFS: Record<string, string> = {
  Bed: '🛏️',
  Sofa: '🛋️',
  Wardrobe: '🗄️',
  Table: '🪑',
  Chair: '💺',
  Curtains: '🪟',
  Mattress: '🛏️',
  Lamp: '💡',
  Mirror: '🪞',
  Rug: '🧶',
}

function motifFor(category: string) {
  const hit = Object.entries(CATEGORY_MOTIFS).find(([key]) =>
    category.toLowerCase().includes(key.toLowerCase())
  )
  return hit?.[1] || '✨'
}

export function FurnitureCard({
  furniture,
  explanation,
  changeBadge = null,
}: FurnitureCardProps) {
  return (
    <article
      className={cn(
        'workspace-card overflow-hidden',
        changeBadge &&
          'ring-2 ring-[#D4A44F]/55 shadow-[0_18px_40px_-24px_rgba(190,141,47,0.55)]'
      )}
    >
      <div className="ws-product-media relative flex h-36 items-center justify-center">
        {furniture.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={furniture.imageUrl}
            alt={furniture.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#BE8D2F]">
            <span className="text-4xl" aria-hidden>
              {motifFor(furniture.category)}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              {furniture.category}
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {changeBadge ? (
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm',
                changeBadge === 'added' ? 'bg-[#4F8A5B]' : 'bg-[#D4A44F]'
              )}
            >
              {changeBadge === 'added' ? 'Added' : 'Updated'}
            </span>
          ) : null}
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#6B6B6B] shadow-sm backdrop-blur">
            {furniture.stockStatus}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-lg font-bold leading-snug text-[#1F1F1F]">
              {furniture.name}
            </h4>
            <p className="mt-1 text-sm font-medium text-[#6B6B6B]">{furniture.category}</p>
          </div>
          <p className="shrink-0 text-base font-bold text-[#BE8D2F]">
            ₹{furniture.price.toLocaleString('en-IN')}
          </p>
        </div>

        <p className="text-[14px] leading-relaxed text-[#6B6B6B]">
          {explanation ||
            furniture.reasonForSelection ||
            'Chosen to balance style, comfort, and the proportions of your room.'}
        </p>

        <p className="text-xs text-[#9a9590]">
          {furniture.dimensions.width} × {furniture.dimensions.length} ×{' '}
          {furniture.dimensions.height} cm · {furniture.style}
        </p>
      </div>
    </article>
  )
}
