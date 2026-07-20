'use client'

import Link from 'next/link'
import { Armchair } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b border-border/70 bg-background/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow">
              <Armchair className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">Builds</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            AI Interior Design Agent
          </div>
        </div>
      </div>
    </nav>
  )
}
