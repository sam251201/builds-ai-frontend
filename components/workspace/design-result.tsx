'use client'

import { FurnitureCard } from './furniture-card'
import { BudgetDashboard } from '@/components/result/budget-dashboard'
import { LayoutValidationCard } from '@/components/result/layout-validation-card'
import { TradeoffsCard } from '@/components/result/tradeoffs-card'
import { BOQTable } from '@/components/result/boq-table'
import type { CustomerBrief, DesignRecommendation } from '@/lib/types'

interface DesignResultProps {
  design: DesignRecommendation
  brief?: CustomerBrief | null
}

export function DesignResult({ design, brief }: DesignResultProps) {
  const title = brief
    ? `${brief.interiorStyle} ${brief.roomType}`
    : 'Design recommendation'

  const boqItems = design.furnitureItems.map((item) => ({
    name: item.name,
    quantity: 1,
    unitPrice: item.price,
  }))

  return (
    <div className="result-enter space-y-6">
      <header className="space-y-2 border-b border-border pb-4">
        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
        {design.summary ? (
          <p className="text-sm text-muted-foreground leading-relaxed">{design.summary}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Layout: {design.layoutStatus}
          {' · '}
          {design.furnitureItems.length} item{design.furnitureItems.length === 1 ? '' : 's'}
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Recommended furniture
        </h3>
        {design.furnitureItems.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {design.furnitureItems.map((item) => (
              <FurnitureCard key={item.id} furniture={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No matching products found.</p>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <BudgetDashboard totalBudget={design.budget} spent={design.totalPrice} />
        <LayoutValidationCard
          roomArea={design.roomArea}
          furnitureArea={design.furnitureFootprint}
          walkingClearance={design.walkingSpace}
          status={design.layoutStatus}
        />
      </div>

      {design.tradeoffs.length > 0 ? <TradeoffsCard tradeoffs={design.tradeoffs} /> : null}

      {boqItems.length > 0 ? <BOQTable items={boqItems} /> : null}
    </div>
  )
}
