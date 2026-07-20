'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BOQItem {
  name: string
  quantity: number
  unitPrice: number
}

interface BOQTableProps {
  items: BOQItem[]
}

export function BOQTable({ items }: BOQTableProps) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Bill of quantities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const itemTotal = item.quantity * item.unitPrice
              return (
                <TableRow key={`${item.name}-${item.unitPrice}`}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{itemTotal.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              <TableCell colSpan={3} className="font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                ₹{total.toLocaleString('en-IN')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
