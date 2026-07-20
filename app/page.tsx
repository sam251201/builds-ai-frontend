import { Hero } from '@/components/landing/hero'
import { FeatureCards } from '@/components/landing/feature-cards'

export default function Page() {
  return (
    <main className="bg-background">
      <Hero />
      <FeatureCards />
    </main>
  )
}
