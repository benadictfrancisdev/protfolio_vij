import { useCallback, useEffect, useState } from 'react'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Preloader } from '@/components/ui/Preloader'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Expertise } from '@/components/sections/Expertise'
import { Specializations } from '@/components/sections/Specializations'
import { Projects } from '@/components/sections/Projects'
import { Education } from '@/components/sections/Education'
import { Certifications } from '@/components/sections/Certifications'
import { Strengths } from '@/components/sections/Strengths'
import { Interests } from '@/components/sections/Interests'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  // Never leave Hero stuck in preloader-hold (clipped / dimmed portrait)
  useEffect(() => {
    if (ready) return
    const t = window.setTimeout(() => setReady(true), 4500)
    return () => window.clearTimeout(t)
  }, [ready])

  return (
    <div className="relative min-h-full bg-bg text-text">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <Preloader onComplete={handleReady} />
      <CustomCursor />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero ready={ready} />
        <About />
        <Expertise />
        <Specializations />
        <Projects />
        <Education />
        <Certifications />
        <Strengths />
        <Interests />
        <Contact />
      </main>

      <Footer />
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  )
}
