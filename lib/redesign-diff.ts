import type { DesignSessionView, Furniture } from '@/lib/types'

export type ChangeKind = 'added' | 'removed' | 'replaced' | 'unchanged'

export interface ProductChangeHighlight {
  id: string
  name: string
  category: string
  kind: ChangeKind
  previousName?: string
}

export interface RedesignHighlight {
  fromVersion: number
  toVersion: number
  headline: string
  userRequest?: string
  budgetDelta: number
  layoutBefore?: string
  layoutAfter?: string
  productsAdded: ProductChangeHighlight[]
  productsRemoved: ProductChangeHighlight[]
  productsReplaced: ProductChangeHighlight[]
  /** item ids that should glow on product cards */
  highlightedIds: string[]
}

export function computeRedesignHighlight(
  previous: DesignSessionView | null,
  next: DesignSessionView
): RedesignHighlight | null {
  if (!previous) return null

  const versionAdvanced = next.currentVersion > previous.currentVersion
  const currentVersion = next.versions.find((v) => v.isCurrent) || next.versions.at(-1)
  const previousVersionMeta = previous.versions.find(
    (v) => v.versionNumber === previous.currentVersion
  )

  const prevByCat = new Map(
    previous.furnitureItems.map((item) => [item.category.toLowerCase(), item])
  )
  const nextByCat = new Map(
    next.furnitureItems.map((item) => [item.category.toLowerCase(), item])
  )
  const prevIds = new Set(previous.furnitureItems.map((item) => item.id))
  const nextIds = new Set(next.furnitureItems.map((item) => item.id))

  const productsAdded: ProductChangeHighlight[] = []
  const productsRemoved: ProductChangeHighlight[] = []
  const productsReplaced: ProductChangeHighlight[] = []
  const highlightedIds: string[] = []

  for (const item of next.furnitureItems) {
    const cat = item.category.toLowerCase()
    const before = prevByCat.get(cat)
    if (!before) {
      productsAdded.push({
        id: item.id,
        name: item.name,
        category: item.category,
        kind: 'added',
      })
      highlightedIds.push(item.id)
    } else if (before.id !== item.id) {
      productsReplaced.push({
        id: item.id,
        name: item.name,
        category: item.category,
        kind: 'replaced',
        previousName: before.name,
      })
      highlightedIds.push(item.id)
    }
  }

  for (const item of previous.furnitureItems) {
    const cat = item.category.toLowerCase()
    if (!nextByCat.has(cat) && !nextIds.has(item.id)) {
      productsRemoved.push({
        id: item.id,
        name: item.name,
        category: item.category,
        kind: 'removed',
      })
    }
  }

  // Also catch same-category misses via id-only add/remove
  for (const item of next.furnitureItems) {
    if (!prevIds.has(item.id) && !highlightedIds.includes(item.id)) {
      productsAdded.push({
        id: item.id,
        name: item.name,
        category: item.category,
        kind: 'added',
      })
      highlightedIds.push(item.id)
    }
  }

  const budgetDelta = Math.round(next.totalPrice - previous.totalPrice)
  const hasProductDiff =
    productsAdded.length > 0 ||
    productsRemoved.length > 0 ||
    productsReplaced.length > 0
  const hasMetaDiff =
    budgetDelta !== 0 ||
    previous.layoutStatus !== next.layoutStatus ||
    previous.style !== next.style ||
    versionAdvanced

  if (!hasProductDiff && !hasMetaDiff) return null

  const headline =
    currentVersion?.changeSummary ||
    (productsReplaced[0]
      ? `Replaced ${productsReplaced[0].category.toLowerCase()}: ${productsReplaced[0].previousName} → ${productsReplaced[0].name}`
      : productsAdded[0]
        ? `Added ${productsAdded[0].name}`
        : productsRemoved[0]
          ? `Removed ${productsRemoved[0].name}`
          : 'Updated your design based on the latest request.')

  return {
    fromVersion: previous.currentVersion || 1,
    toVersion: next.currentVersion || previous.currentVersion || 1,
    headline,
    userRequest: currentVersion?.userRequest,
    budgetDelta,
    layoutBefore: previousVersionMeta?.layoutStatus || previous.layoutStatus,
    layoutAfter: currentVersion?.layoutStatus || next.layoutStatus,
    productsAdded,
    productsRemoved,
    productsReplaced,
    highlightedIds,
  }
}

export function changeBadgeForItem(
  item: Furniture,
  highlight: RedesignHighlight | null
): 'added' | 'updated' | null {
  if (!highlight) return null
  if (highlight.productsAdded.some((p) => p.id === item.id)) return 'added'
  if (highlight.productsReplaced.some((p) => p.id === item.id)) return 'updated'
  if (highlight.highlightedIds.includes(item.id)) return 'updated'
  return null
}
