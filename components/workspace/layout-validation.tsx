import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ruler } from 'lucide-react'

interface LayoutValidationProps {
  roomArea: number
  furnitureFootprint: number
  walkingSpace: number
  status: 'PASS' | 'REPLAN'
}

export function LayoutValidation({
  roomArea,
  furnitureFootprint,
  walkingSpace,
  status,
}: LayoutValidationProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Ruler className="w-4 h-4 text-primary" />
          Space Validation
        </CardTitle>
        <Badge variant={status === 'PASS' ? 'default' : 'destructive'}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Room Area</span>
            <span className="font-semibold text-foreground">{roomArea.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Furniture Footprint</span>
            <span className="font-semibold text-foreground">{furnitureFootprint.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Walking Space</span>
            <span className="font-semibold text-green-600">{walkingSpace.toFixed(2)} m²</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Coverage Ratio</p>
          <div className="flex items-center gap-2">
            <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min((furnitureFootprint / roomArea) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground">
              {((furnitureFootprint / roomArea) * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          {status === 'PASS'
            ? 'Your layout has sufficient walking space and furniture balance.'
            : 'Consider removing some items or choosing smaller alternatives.'}
        </p>
      </CardContent>
    </Card>
  )
}
