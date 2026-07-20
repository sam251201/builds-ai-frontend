import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface TradeoffsCardProps {
  tradeoffs: string[]
}

export function TradeoffsCard({ tradeoffs }: TradeoffsCardProps) {
  return (
    <Card className="border-border bg-accent/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          Design Trade-offs & Priorities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tradeoffs.map((tradeoff, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="text-primary font-semibold flex-shrink-0">•</span>
              <span className="text-muted-foreground">{tradeoff}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
