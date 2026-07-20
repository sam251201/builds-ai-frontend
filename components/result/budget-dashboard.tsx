'use client'

import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { SectionHeading } from '@/components/workspace/section-heading'

interface BudgetDashboardProps {
  totalBudget: number
  spent: number
}

export function BudgetDashboard({ totalBudget, spent }: BudgetDashboardProps) {
  const remaining = totalBudget - spent
  const percentage = totalBudget > 0 ? (spent / totalBudget) * 100 : 0
  const isOverBudget = spent > totalBudget

  return (
    <div className="workspace-card p-6">
      <SectionHeading
        title="Budget"
        subtitle="How your selections sit against the room budget."
        info="Tracks your current spending and remaining budget."
        className="mb-4"
      />

      <p className="font-display text-2xl font-bold tracking-tight text-[#1F1F1F]">
        ₹{spent.toLocaleString('en-IN')}
        <span className="text-lg font-medium text-[#6B6B6B]">
          {' '}
          / ₹{totalBudget.toLocaleString('en-IN')}
        </span>
      </p>

      <div className="ws-progress mt-4">
        <span style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
            Remaining
          </p>
          <p
            className={`text-base font-semibold ${
              isOverBudget ? 'text-[#C65B5B]' : 'text-[#1F1F1F]'
            }`}
          >
            ₹{remaining.toLocaleString('en-IN')}
          </p>
        </div>
        {isOverBudget ? (
          <span className="ws-badge-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            Over budget
          </span>
        ) : (
          <span className="ws-badge-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Within budget
          </span>
        )}
      </div>
    </div>
  )
}
