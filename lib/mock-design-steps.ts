import { DesignStep } from './types'

export const DESIGN_GENERATION_STEPS: DesignStep[] = [
  {
    id: '1',
    title: 'Reading Customer Brief',
    description: 'Analyzing room dimensions, budget, and style preferences',
    status: 'pending',
    delay: 500,
  },
  {
    id: '2',
    title: 'Searching Furniture Catalog',
    description: 'Searching 500+ furniture items for matches',
    status: 'pending',
    delay: 1500,
  },
  {
    id: '3',
    title: 'Finding Style Matches',
    description: 'Identifying pieces that match your interior style',
    status: 'pending',
    delay: 2500,
  },
  {
    id: '4',
    title: 'Checking Room Dimensions',
    description: 'Validating furniture fit and space efficiency',
    status: 'pending',
    delay: 3500,
  },
  {
    id: '5',
    title: 'Validating Budget',
    description: 'Ensuring recommendations fit within budget constraints',
    status: 'pending',
    delay: 4500,
  },
  {
    id: '6',
    title: 'Optimizing Selection',
    description: 'Fine-tuning furniture combinations for best results',
    status: 'pending',
    delay: 5500,
  },
  {
    id: '7',
    title: 'Preparing Recommendation',
    description: 'Generating final design proposal',
    status: 'pending',
    delay: 6500,
  },
]

export function generateDesignRecommendationSummary(
  roomType: string,
  style: string,
  budget: number
): string {
  const summaries: { [key: string]: string } = {
    'Living Room-Modern': `A sophisticated modern ${roomType.toLowerCase()} design that maximizes comfort and style. This curated selection combines contemporary furniture pieces that create a cohesive, magazine-worthy space. Each piece has been carefully selected to complement your ₹${budget.toLocaleString('en-IN')} budget while maintaining high-quality aesthetics.`,
    'Bedroom-Scandinavian': `Create a serene Scandinavian ${roomType.toLowerCase()} sanctuary with light woods and minimalist design. This collection emphasizes comfort and simplicity, perfect for a relaxing retreat. Carefully sourced within your ₹${budget.toLocaleString('en-IN')} budget.`,
    'Home Office-Contemporary': `Transform your workspace into a productive, stylish ${roomType.toLowerCase()} environment. This contemporary design balances functionality with modern aesthetics, featuring ergonomic furniture and smart organization. Optimized for your ₹${budget.toLocaleString('en-IN')} budget.`,
  }

  const key = `${roomType}-${style}`
  return summaries[key] || `A beautiful ${style.toLowerCase()} ${roomType.toLowerCase()} design tailored to your ₹${budget.toLocaleString('en-IN')} budget and preferences. Each furniture piece has been selected to create harmony and maximize functionality in your space.`
}

export function generateTradeoffs(budget: number, roomLength: number, roomWidth: number): string[] {
  const tradeoffs = [
    'Prioritized premium seating and lighting over decorative accessories',
    'Selected versatile neutral pieces for maximum styling flexibility',
    'Optimized for walkability while maintaining furniture coverage',
    `Balanced quality and quantity within ₹${budget.toLocaleString('en-IN')} budget`,
  ]

  if (roomLength * roomWidth < 20) {
    tradeoffs.push('Focused on space-efficient, multifunctional pieces')
  } else {
    tradeoffs.push('Leveraged room size for layered, comfortable arrangements')
  }

  return tradeoffs.slice(0, 5)
}
