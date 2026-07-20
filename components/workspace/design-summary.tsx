import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface DesignSummaryProps {
  summary: string
}

export function DesignSummary({ summary }: DesignSummaryProps) {
  return (
    <Card className="bg-accent/5 border-accent/20 border">
      <CardContent className="pt-6 flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-foreground mb-1">Design Summary</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
        </div>
      </CardContent>
    </Card>
  )
}
