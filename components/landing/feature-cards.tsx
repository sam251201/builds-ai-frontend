'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FeatureCards() {
  const features = [
    {
      emoji: '🛋',
      title: 'Real Furniture',
      description: 'Curated selection from 500+ premium furniture items that perfectly match your room size and design aesthetic.',
    },
    {
      emoji: '💰',
      title: 'Budget Optimized',
      description: 'Smart algorithm ensures every recommendation respects your budget with transparent cost breakdowns.',
    },
    {
      emoji: '📐',
      title: 'Layout Validation',
      description: 'AI-powered room analysis guarantees perfect fit with adequate walking clearance and optimal placement.',
    },
    {
      emoji: '🤖',
      title: 'AI Planning',
      description: 'Intelligent design agent understands your preferences and creates cohesive interior design proposals.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-reveal>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How Builds Works
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Four powerful features to transform your interior design process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="premium-card glass-reflection border-border bg-card hover:shadow-xl transition-all duration-300 hover:border-accent/50"
              data-reveal
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <CardHeader>
                <div className="feature-icon text-4xl mb-4">{feature.emoji}</div>
                <CardTitle className="text-xl font-display text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
