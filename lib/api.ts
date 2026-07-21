import type {
  AlternativeView,
  CustomerBrief,
  DecisionExplanation,
  DesignRecommendation,
  DesignSessionView,
  Furniture,
} from '@/lib/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000'

export interface ApiProduct {
  item_id: string
  name: string
  category: string
  style_tags: string
  price_inr: number
  width_cm?: number | null
  depth_cm?: number | null
  height_cm?: number | null
  color_finish?: string | null
  in_stock: number
  reason_for_selection?: string | null
}

export interface ApiDesignResponse {
  summary: string
  products: ApiProduct[]
  budget: {
    budget: number
    spent: number
    remaining: number
    within_budget: boolean
  }
  layout: {
    room_area: number
    furniture_area: number
    occupancy_percent: number
    status: string
  }
  tradeoffs: string[]
}

export interface ApiSessionResponse {
  session_id: string
  status: string
  current_version?: number
  max_versions?: number
  refinements_locked?: boolean
  current_design: {
    room_type: string
    style: string
    budget: number
    dimensions?: {
      length_cm: number
      width_cm: number
      ceiling_height_cm: number
    } | null
    must_haves: string[]
    constraints: string[]
    preferences: string[]
    priority_scores: Record<string, number>
    reasoning: string[]
  }
  budget_summary: {
    budget: number
    spent: number
    remaining: number
    within_budget: boolean
  } | null
  layout_summary: {
    room_area: number
    furniture_area: number
    occupancy_percent: number
    status: string
  } | null
  selected_products: ApiProduct[]
  alternative_products: Record<
    string,
    Array<{
      product: ApiProduct
      pros: string[]
      cons: string[]
      price_difference: number
      style_match?: string | null
      space_match?: string | null
      reason_not_selected?: string | null
    }>
  >
  decision_explanations: Array<{
    item_id: string
    name: string
    category: string
    outcome: string
    reasons: string[]
    compared_to?: string | null
  }>
  design_rationale?: {
    summary?: string
    highlights?: Array<{
      item_id?: string
      name?: string
      why?: string
    }>
    source?: string
  } | null
  versions?: Array<{
    version_number: number
    timestamp: string
    user_request: string
    change_summary: string
    budget_summary?: {
      budget: number
      spent: number
      remaining: number
      within_budget: boolean
    } | null
    layout_summary?: {
      room_area: number
      furniture_area: number
      occupancy_percent: number
      status: string
    } | null
    product_count: number
    style: string
    is_current: boolean
  }>
  warnings: string[]
  suggested_actions: string[]
  intent?: {
    intent: string
    confidence: number
    source?: string
  } | null
  explanation?: {
    explanation?: string
    source?: string
  } | null
  comparison?: Record<string, unknown> | null
  version_comparison?: {
    version_a: number
    version_b: number
    products_added: ApiProduct[]
    products_removed: ApiProduct[]
    products_changed: Array<{
      category?: string
      from: ApiProduct
      to: ApiProduct
    }>
    budget_difference: number
    layout_difference: {
      occupancy_a: number
      occupancy_b: number
      status_a?: string | null
      status_b?: string | null
      delta_occupancy: number
    }
    style_difference: {
      style_a: string
      style_b: string
      changed: boolean
    }
    summary: string
  } | null
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') detail = body.detail
      else if (Array.isArray(body?.detail)) detail = JSON.stringify(body.detail)
    } catch {
      // ignore parse errors
    }
    throw new ApiError(detail, response.status)
  }

  return response.json() as Promise<T>
}

function briefPayload(brief: CustomerBrief) {
  return {
    room_type: brief.roomType,
    room_length: brief.roomLength,
    room_width: brief.roomWidth,
    ceiling_height: brief.ceilingHeight,
    budget: brief.budget,
    interior_style: brief.interiorStyle,
    must_have_items: brief.mustHaveItems,
    additional_notes: brief.additionalNotes,
  }
}

export interface CatalogOptions {
  categories: string[]
  styles: string[]
  room_types: string[]
}

export async function fetchCatalogOptions(): Promise<CatalogOptions> {
  return request('/api/catalog/options')
}

export async function startDesignSession(brief: CustomerBrief): Promise<ApiSessionResponse> {
  return request('/design/start', {
    method: 'POST',
    body: JSON.stringify(briefPayload(brief)),
  })
}

export async function updateDesignSession(
  sessionId: string,
  message: string
): Promise<ApiSessionResponse> {
  return request(`/design/update/${sessionId}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export async function finalizeDesignSession(sessionId: string): Promise<ApiSessionResponse> {
  return request(`/design/finalize/${sessionId}`, {
    method: 'POST',
  })
}

export async function getDesignSession(sessionId: string): Promise<ApiSessionResponse> {
  return request(`/design/${sessionId}`)
}

export async function restoreDesignVersion(
  sessionId: string,
  versionNumber: number
): Promise<ApiSessionResponse> {
  return request(`/design/restore/${sessionId}`, {
    method: 'POST',
    body: JSON.stringify({ version_number: versionNumber }),
  })
}

export async function compareDesignVersions(
  sessionId: string,
  versionA: number,
  versionB: number
): Promise<ApiSessionResponse> {
  return request(`/design/compare/${sessionId}`, {
    method: 'POST',
    body: JSON.stringify({ version_a: versionA, version_b: versionB }),
  })
}

/** Legacy one-shot endpoint — kept for compatibility. */
export async function createDesign(brief: CustomerBrief): Promise<ApiDesignResponse> {
  return request('/api/design', {
    method: 'POST',
    body: JSON.stringify(briefPayload(brief)),
  })
}

function mapProduct(product: ApiProduct): Furniture {
  return {
    id: product.item_id,
    name: product.name,
    category: product.category,
    style: product.style_tags?.split(',')[0]?.trim() || 'General',
    dimensions: {
      width: product.width_cm || 0,
      length: product.depth_cm || 0,
      height: product.height_cm || 0,
    },
    price: product.price_inr || 0,
    stockStatus: product.in_stock ? 'In Stock' : 'Pre-order',
    reasonForSelection:
      product.reason_for_selection ||
      `${product.category} selected for style and budget fit`,
  }
}

function mapAlternative(alt: {
  product: ApiProduct
  pros: string[]
  cons: string[]
  price_difference: number
  style_match?: string | null
  space_match?: string | null
  reason_not_selected?: string | null
}): AlternativeView {
  return {
    product: mapProduct(alt.product),
    pros: alt.pros || [],
    cons: alt.cons || [],
    priceDifference: alt.price_difference || 0,
    styleMatch: alt.style_match,
    spaceMatch: alt.space_match,
    reasonNotSelected: alt.reason_not_selected,
  }
}

export function mapSessionResponse(response: ApiSessionResponse): DesignSessionView {
  const roomArea = (response.layout_summary?.room_area || 0) / 10000
  const furnitureFootprint = (response.layout_summary?.furniture_area || 0) / 10000
  const spent = response.budget_summary?.spent || 0
  const budget = response.budget_summary?.budget || response.current_design.budget || 0
  const layoutStatus = response.layout_summary?.status || 'PASS'

  const alternatives: Record<string, AlternativeView[]> = {}
  for (const [key, alts] of Object.entries(response.alternative_products || {})) {
    alternatives[key] = alts.map(mapAlternative)
  }

  const decisionExplanations: DecisionExplanation[] = (
    response.decision_explanations || []
  ).map((item) => ({
    itemId: item.item_id,
    name: item.name,
    category: item.category,
    outcome: item.outcome,
    reasons: item.reasons || [],
    comparedTo: item.compared_to,
  }))

  const versions = (response.versions || []).map((v) => ({
    versionNumber: v.version_number,
    timestamp: v.timestamp,
    userRequest: v.user_request,
    changeSummary: v.change_summary,
    productCount: v.product_count,
    style: v.style,
    isCurrent: v.is_current,
    budgetSpent: v.budget_summary?.spent || 0,
    budgetTotal: v.budget_summary?.budget || budget,
    layoutStatus: v.layout_summary?.status || 'PASS',
  }))

  let versionComparison: DesignSessionView['versionComparison'] = null
  if (response.version_comparison) {
    const vc = response.version_comparison
    versionComparison = {
      versionA: vc.version_a,
      versionB: vc.version_b,
      productsAdded: (vc.products_added || []).map(mapProduct),
      productsRemoved: (vc.products_removed || []).map(mapProduct),
      productsChanged: (vc.products_changed || []).map((row) => ({
        category: row.category,
        from: mapProduct(row.from),
        to: mapProduct(row.to),
      })),
      budgetDifference: vc.budget_difference,
      layoutDifference: {
        occupancyA: vc.layout_difference.occupancy_a,
        occupancyB: vc.layout_difference.occupancy_b,
        statusA: vc.layout_difference.status_a,
        statusB: vc.layout_difference.status_b,
        deltaOccupancy: vc.layout_difference.delta_occupancy,
      },
      styleDifference: {
        styleA: vc.style_difference.style_a,
        styleB: vc.style_difference.style_b,
        changed: vc.style_difference.changed,
      },
      summary: vc.summary,
    }
  }

  const summaryParts = [
    `${response.current_design.style} ${response.current_design.room_type}`.trim(),
    response.budget_summary
      ? `Spend ₹${spent.toLocaleString('en-IN')} of ₹${budget.toLocaleString('en-IN')}`
      : null,
    response.layout_summary
      ? `Layout ${response.layout_summary.status} (${response.layout_summary.occupancy_percent}% occupancy)`
      : null,
    response.current_version
      ? `Design ${response.current_version}`
      : null,
  ].filter(Boolean)

  const designRationale = response.design_rationale
    ? {
        summary: response.design_rationale.summary || '',
        highlights: (response.design_rationale.highlights || []).map((h) => ({
          itemId: h.item_id || '',
          name: h.name || '',
          why: h.why || '',
        })),
        source: response.design_rationale.source || null,
      }
    : null

  return {
    sessionId: response.session_id,
    status: response.status,
    currentVersion: response.current_version || 0,
    maxVersions: response.max_versions || 5,
    refinementsLocked: Boolean(response.refinements_locked),
    roomType: response.current_design.room_type,
    style: response.current_design.style,
    budget,
    summary: summaryParts.join(' · '),
    furnitureItems: (response.selected_products || []).map(mapProduct),
    totalPrice: spent,
    roomArea,
    furnitureFootprint,
    walkingSpace: Math.max(0, roomArea - furnitureFootprint),
    layoutStatus,
    occupancyPercent: response.layout_summary?.occupancy_percent || 0,
    withinBudget: Boolean(response.budget_summary?.within_budget),
    alternatives,
    decisionExplanations,
    designRationale,
    versions,
    versionComparison,
    productComparison: response.comparison || null,
    warnings: response.warnings || [],
    suggestedActions: response.suggested_actions || [],
    reasoning: response.current_design.reasoning || [],
    explanationText: response.explanation?.explanation || null,
    intentLabel: response.intent?.intent || null,
    mustHaves: response.current_design.must_haves || [],
  }
}

export function mapDesignResponse(response: ApiDesignResponse): DesignRecommendation {
  const roomArea = response.layout.room_area / 10000
  const furnitureFootprint = response.layout.furniture_area / 10000

  return {
    id: crypto.randomUUID(),
    summary: response.summary,
    furnitureItems: response.products.map(mapProduct),
    totalPrice: response.budget.spent,
    budget: response.budget.budget,
    roomArea,
    furnitureFootprint,
    walkingSpace: Math.max(0, roomArea - furnitureFootprint),
    layoutStatus: response.layout.status === 'PASS' ? 'PASS' : 'REPLAN',
    tradeoffs: response.tradeoffs,
  }
}
