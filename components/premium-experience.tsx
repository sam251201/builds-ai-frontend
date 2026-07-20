'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'

export function PremiumExperience() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const root = document.documentElement

    const onScroll = () => setScrolled(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px' }
    )

    document.querySelectorAll('[data-reveal]').forEach((node) => revealObserver.observe(node))
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('[data-reveal]')) revealObserver.observe(node)
          node.querySelectorAll('[data-reveal]').forEach((child) => revealObserver.observe(child))
        })
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    const onMouseMove = (event: MouseEvent) => {
      if (!finePointer || reduceMotion) return
      root.style.setProperty('--cursor-x', `${event.clientX}px`)
      root.style.setProperty('--cursor-y', `${event.clientY}px`)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    let activeMagnetic: HTMLElement | null = null
    const onMagneticMove = (event: MouseEvent) => {
      if (!finePointer || reduceMotion) return
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-magnetic]')
      if (activeMagnetic && activeMagnetic !== target) {
        activeMagnetic.style.setProperty('--magnetic-x', '0px')
        activeMagnetic.style.setProperty('--magnetic-y', '0px')
      }
      activeMagnetic = target
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--magnetic-x', `${(event.clientX - rect.left - rect.width / 2) * 0.14}px`)
      target.style.setProperty('--magnetic-y', `${(event.clientY - rect.top - rect.height / 2) * 0.14}px`)
    }
    const resetMagnetic = () => {
      activeMagnetic?.style.setProperty('--magnetic-x', '0px')
      activeMagnetic?.style.setProperty('--magnetic-y', '0px')
      activeMagnetic = null
    }
    document.addEventListener('mousemove', onMagneticMove, { passive: true })
    document.addEventListener('mouseleave', resetMagnetic)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      revealObserver.disconnect()
      mutationObserver.disconnect()
      document.removeEventListener('mousemove', onMagneticMove)
      document.removeEventListener('mouseleave', resetMagnetic)
    }
  }, [])

  return (
    <>
      <div className="cursor-glow" aria-hidden="true" />
      <Link
        href="/workspace"
        className={`floating-ask ${scrolled ? 'floating-ask--visible' : ''}`}
        aria-label="Ask Builds"
      >
        <span className="floating-ask__pulse" />
        <Sparkles className="h-4 w-4" />
        <span>Ask Builds</span>
        <MessageCircle className="h-4 w-4" />
      </Link>
    </>
  )
}
