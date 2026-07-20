import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DollarSign } from 'lucide-react'

interface BudgetCardProps {
  totalPrice: number
  budget: number
}

export function BudgetCard({ totalPrice, budget }: BudgetCardProps) {
  const percentage = Math.min((totalPrice / budget) * 100, 100)
  const remaining = Math.max(0, budget - totalPrice)
  const isWithinBudget = totalPrice <= budget

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Budget Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Allocated</span>
            <span className="text-sm font-semibold text-foreground">
              ₹{totalPrice.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-lg font-semibold text-foreground">
              ₹{totalPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className={`text-lg font-semibold ${isWithinBudget ? 'text-green-600' : 'text-red-600'}`}>
              ₹{remaining.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className={`text-xs font-medium ${isWithinBudget ? 'text-green-600' : 'text-red-600'}`}>
            {isWithinBudget ? '✓ Within Budget' : '✗ Over Budget'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
