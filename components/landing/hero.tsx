'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      section.style.setProperty('--hero-x', `${x * 12}px`)
      section.style.setProperty('--hero-y', `${y * 9}px`)
    }
    const reset = () => {
      section.style.setProperty('--hero-x', '0px')
      section.style.setProperty('--hero-y', '0px')
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', reset)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', reset)
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero-premium relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="hero-parallax absolute -inset-5">
        <Image
          src="/hero-living-room.png"
          alt="Luxury living room"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/45" />
      <div className="hero-ambient" aria-hidden="true">
        {[14, 28, 43, 61, 74, 88].map((left, index) => (
          <i key={left} style={{ left: `${left}%`, animationDelay: `${index * -1.4}s` }} />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 flex flex-col items-center justify-center gap-8 text-center px-4 max-w-2xl">
        <div className="space-y-4">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-white/90 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#ead58d]" />
            INTELLIGENT INTERIOR DESIGN
          </div>
          <h1 className="font-display text-6xl font-bold tracking-tight text-white leading-tight">
            Design Your Dream Home with AI
          </h1>
          <p className="text-xl text-gray-100 font-light">
            Meet Builds—your intelligent interior design companion. Get personalized furniture recommendations, budget-conscious planning, and space validation in minutes.
          </p>
        </div>

        <Link href="/transition" data-magnetic>
          <Button
            size="lg"
            className="premium-button bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ✨ Start Designing
          </Button>
        </Link>

        <p className="text-sm text-gray-200 font-light tracking-wide">
          No account required • AI Powered • Real Furniture • Budget Safe
        </p>
      </div>
    </section>
  )
}
