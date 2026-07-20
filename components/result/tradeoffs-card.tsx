'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TradeoffsCardProps {
  tradeoffs: string[]
}

export function TradeoffsCard({ tradeoffs }: TradeoffsCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Trade-offs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tradeoffs.map((item) => (
            <li key={item} className="text-sm text-muted-foreground leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
