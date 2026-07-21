export interface CustomerBrief {
  roomType: string
  roomLength: number
  roomWidth: number
  ceilingHeight: number
  budget: number
  interiorStyle: string
  mustHaveItems: string[]
  additionalNotes: string
}

export interface Furniture {
  id: string
  name: string
  category: string
  style: string
  dimensions: {
    width: number
    length: number
    height: number
  }
  price: number
  stockStatus: 'In Stock' | 'Limited' | 'Pre-order'
  reasonForSelection: string
  imageUrl?: string
}

export interface DesignStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  delay: number
}

export interface DesignRecommendation {
  id: string
  summary: string
  furnitureItems: Furniture[]
  totalPrice: number
  budget: number
  roomArea: number
  furnitureFootprint: number
  walkingSpace: number
  layoutStatus: 'PASS' | 'REPLAN'
  tradeoffs: string[]
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AlternativeView {
  product: Furniture
  pros: string[]
  cons: string[]
  priceDifference: number
  styleMatch?: string | null
  spaceMatch?: string | null
  reasonNotSelected?: string | null
}

export interface DecisionExplanation {
  itemId: string
  name: string
  category: string
  outcome: string
  reasons: string[]
  comparedTo?: string | null
}

export interface DesignVersionView {
  versionNumber: number
  timestamp: string
  userRequest: string
  changeSummary: string
  productCount: number
  style: string
  isCurrent: boolean
  budgetSpent: number
  budgetTotal: number
  layoutStatus: string
}

export interface VersionComparisonView {
  versionA: number
  versionB: number
  productsAdded: Furniture[]
  productsRemoved: Furniture[]
  productsChanged: Array<{ category?: string; from: Furniture; to: Furniture }>
  budgetDifference: number
  layoutDifference: {
    occupancyA: number
    occupancyB: number
    statusA?: string | null
    statusB?: string | null
    deltaOccupancy: number
  }
  styleDifference: {
    styleA: string
    styleB: string
    changed: boolean
  }
  summary: string
}

export interface DesignRationaleView {
  summary: string
  highlights: Array<{
    itemId: string
    name: string
    why: string
  }>
  source?: string | null
}

export interface DesignSessionView {
  sessionId: string
  status: 'ACTIVE' | 'REFINING' | 'COMPLETED' | string
  currentVersion: number
  maxVersions: number
  refinementsLocked: boolean
  roomType: string
  style: string
  budget: number
  summary: string
  furnitureItems: Furniture[]
  totalPrice: number
  roomArea: number
  furnitureFootprint: number
  walkingSpace: number
  layoutStatus: 'PASS' | 'REPLAN' | 'WARNING' | string
  occupancyPercent: number
  withinBudget: boolean
  alternatives: Record<string, AlternativeView[]>
  decisionExplanations: DecisionExplanation[]
  designRationale?: DesignRationaleView | null
  versions: DesignVersionView[]
  versionComparison?: VersionComparisonView | null
  productComparison?: Record<string, unknown> | null
  warnings: string[]
  suggestedActions: string[]
  reasoning: string[]
  explanationText?: string | null
  intentLabel?: string | null
  mustHaves: string[]
}
