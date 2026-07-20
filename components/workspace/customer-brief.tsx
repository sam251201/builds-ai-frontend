'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { CustomerBrief as CustomerBriefType } from '@/lib/types'
import { fetchCatalogOptions } from '@/lib/api'

interface CustomerBriefProps {
  onGenerate: (brief: CustomerBriefType) => void
  isLoading: boolean
}

export function CustomerBrief({ onGenerate, isLoading }: CustomerBriefProps) {
  const [roomType, setRoomType] = useState('')
  const [roomLength, setRoomLength] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [ceilingHeight, setCeilingHeight] = useState('')
  const [budget, setBudget] = useState('')
  const [interiorStyle, setInteriorStyle] = useState('')
  const [mustHaveItems, setMustHaveItems] = useState<string[]>([])
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [itemInput, setItemInput] = useState('')
  const [categorySelectKey, setCategorySelectKey] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [styles, setStyles] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState<string[]>([])
  const [optionsError, setOptionsError] = useState<string | null>(null)
  const [optionsLoading, setOptionsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true

    const loadOptions = async () => {
      setOptionsLoading(true)
      setOptionsError(null)
      try {
        const options = await fetchCatalogOptions()
        if (!active) return
        setCategories(options.categories)
        setStyles(options.styles)
        setRoomTypes(options.room_types)
      } catch (error) {
        if (!active) return
        setOptionsError(
          error instanceof Error ? error.message : 'Could not load catalog options'
        )
      } finally {
        if (active) setOptionsLoading(false)
      }
    }

    void loadOptions()
    return () => {
      active = false
    }
  }, [])

  const isFormValid =
    roomType &&
    roomLength &&
    roomWidth &&
    ceilingHeight &&
    budget &&
    interiorStyle

  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return
    if (!itemInput.trim()) return

    if (!mustHaveItems.includes(itemInput.trim())) {
      setMustHaveItems([...mustHaveItems, itemInput.trim()])
    }
    setItemInput('')
  }

  const handleRemoveItem = (item: string) => {
    setMustHaveItems(mustHaveItems.filter((i) => i !== item))
  }

  const handleGenerate = () => {
    if (!isFormValid) return

    const brief: CustomerBriefType = {
      roomType,
      roomLength: Number(roomLength),
      roomWidth: Number(roomWidth),
      ceilingHeight: Number(ceilingHeight),
      budget: Number(budget),
      interiorStyle,
      mustHaveItems,
      additionalNotes,
    }

    onGenerate(brief)
  }

  return (
    <Card className="workspace-card sticky top-0 z-40 border-[#EFE6D5] bg-white shadow-[0_12px_36px_-24px_rgba(70,55,20,0.35)]">
      <CardHeader className="space-y-1.5 pb-2">
        <CardTitle className="font-display text-xl font-bold text-[#1F1F1F]">
          Room Details
        </CardTitle>
        <p className="text-sm font-medium text-[#6B6B6B]">
          Tell Builds about the space you want to design.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {optionsLoading ? (
          <p className="text-sm text-muted-foreground">Loading catalog options…</p>
        ) : null}
        {optionsError ? (
          <p className="text-sm text-red-600">{optionsError}</p>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Room Type</label>
          <Select value={roomType} onValueChange={(value) => value && setRoomType(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Room Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Length"
              value={roomLength}
              onChange={(e) => setRoomLength(e.target.value)}
              className="bg-background"
            />
            <Input
              type="number"
              placeholder="Width"
              value={roomWidth}
              onChange={(e) => setRoomWidth(e.target.value)}
              className="bg-background"
            />
            <Input
              type="number"
              placeholder="Height"
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Budget (₹)</label>
          <Input
            type="number"
            placeholder="e.g., 100000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Interior Style</label>
          <Select value={interiorStyle} onValueChange={(value) => value && setInteriorStyle(value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Must Have Items</label>
          <Select
            key={categorySelectKey}
            onValueChange={(value) => {
              const next = typeof value === 'string' ? value : ''
              if (!next) return
              if (!mustHaveItems.includes(next)) {
                setMustHaveItems((prev) => [...prev, next])
              }
              setCategorySelectKey((key) => key + 1)
            }}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Pick category from catalog" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Or type a category…"
              value={itemInput}
              onChange={(e) => setItemInput(e.target.value)}
              onKeyDown={handleAddItem}
              className="bg-background"
              list="item-suggestions"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="px-3"
            >
              Add
            </Button>
            <datalist id="item-suggestions">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          {mustHaveItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mustHaveItems.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleRemoveItem(item)}
                >
                  {item}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Additional Notes</label>
          <Textarea
            placeholder="Any specific preferences or constraints..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="bg-background min-h-24 resize-none"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!isFormValid || isLoading || optionsLoading || !!optionsError}
          className="ws-btn-primary h-12 w-full text-base"
          size="lg"
        >
          {isLoading ? 'Generating…' : 'Generate Design'}
        </Button>
      </CardContent>
    </Card>
  )
}
