import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
import { heroSlides } from '@/data/heroSlides'
import { SlideVisual } from '@/components/hero/SlideVisual'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

const TOTAL = heroSlides.length

export function HeroCarousel() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const autoplay = useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  )

  const plugins = useMemo(
    () => (reduce ? [] : [autoplay.current]),
    [reduce],
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      containScroll: false,
      dragFree: false,
      skipSnaps: false,
      duration: reduce ? 10 : 28,
      watchDrag: reduce ? false : true,
      dragThreshold: 8,
    },
    plugins,
  )

  const tweenSlides = useCallback(() => {
    if (!emblaApi || reduce) return
    const slides = emblaApi.slideNodes()
    const scrollSnaps = emblaApi.scrollSnapList()
    const scrollProgress = emblaApi.scrollProgress()

    slides.forEach((slideNode, i) => {
      let diffToTarget = scrollSnaps[i] - scrollProgress
      // Normalize for loop distance into [-0.5, 0.5]
      if (diffToTarget > 0.5) diffToTarget -= 1
      if (diffToTarget < -0.5) diffToTarget += 1

      const abs = Math.min(1, Math.abs(diffToTarget) * 2.2)
      const scale = 1 - abs * 0.12
      const opacity = 1 - abs * 0.55
      const panel = slideNode.querySelector('[data-slide-panel]') as HTMLElement | null
      if (panel) {
        panel.style.transform = `translate3d(0,0,0) scale(${scale})`
        panel.style.opacity = `${Math.max(0.4, opacity)}`
      }
    })
  }, [emblaApi, reduce])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const onScroll = useCallback(() => {
    if (!emblaApi) return
    const p = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    setProgress(p)
    tweenSlides()
  }, [emblaApi, tweenSlides])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    onScroll()
    tweenSlides()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', tweenSlides)
    emblaApi.on('pointerDown', () => {
      setDragging(true)
      autoplay.current.stop()
    })
    emblaApi.on('pointerUp', () => setDragging(false))
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
      emblaApi.off('scroll', onScroll)
      emblaApi.off('reInit', tweenSlides)
    }
  }, [emblaApi, onSelect, onScroll, tweenSlides])

  // Preload adjacent images
  useEffect(() => {
    heroSlides.forEach((slide) => {
      if (!slide.image) return
      const img = new Image()
      img.src = slide.image
    })
  }, [])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollPrev, scrollNext])

  const slide = heroSlides[index]

  return (
    <div
      className="relative flex min-h-[calc(100vh-5.5rem)] flex-col justify-center"
      data-hero-carousel
      aria-roledescription="carousel"
      aria-label="Professional focus areas"
    >
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
        {/* LEFT — synchronized copy */}
        <div className="order-2 lg:order-1 lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                Focus · {slide.index}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase leading-[0.92] tracking-tight text-text">
                {slide.heading}
              </h2>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {slide.specialization}
              </p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER — draggable Embla images */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <div
            className={cn(
              'relative mx-auto w-full max-w-[560px] select-none lg:max-w-none',
              dragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
            style={{ touchAction: 'pan-y' }}
            ref={emblaRef}
            data-carousel-viewport
          >
            <div className="flex">
              {heroSlides.map((item, i) => (
                <div
                  key={item.id}
                  className="min-w-0 flex-[0_0_100%] px-1 sm:px-2"
                  data-carousel-slide={i}
                  aria-hidden={i !== index}
                >
                  <div
                    data-slide-panel
                    className="aspect-[5/4] w-full will-change-transform"
                    style={{ transformOrigin: 'center center' }}
                  >
                    <SlideVisual slide={item} priority={i === 0 || Math.abs(i - index) <= 1} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted/70 lg:hidden">
            <MoveHorizontal size={12} /> Swipe to explore
          </p>
        </div>

        {/* RIGHT — tech + detail */}
        <div className="order-3 lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-right'}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="lg:pl-2"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {slide.tech.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.4, ease: EASE_OUT }}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-text"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">{slide.detail}</p>
              <div className="mt-8 hidden h-px w-16 bg-accent/50 lg:block" />
              <p className="mt-4 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted lg:block">
                Drag the image
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM controls */}
      <div className="mt-10 flex flex-col gap-5 sm:mt-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              data-carousel-prev
              aria-label="Previous slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-text transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              data-carousel-next
              aria-label="Next slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-text transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3" role="tablist" aria-label="Slides">
            {heroSlides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}: ${item.heading}`}
                data-carousel-dot={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-accent' : 'w-1.5 bg-white/25 hover:bg-white/50',
                )}
              />
            ))}
          </div>

          <div className="min-w-[4.5rem] text-right font-mono text-xs tabular-nums text-muted">
            <span className="text-text" data-carousel-index>
              {slide.index}
            </span>
            <span> / 0{TOTAL}</span>
          </div>
        </div>

        <div className="h-px w-full overflow-hidden bg-white/10" aria-hidden="true">
          <motion.div
            className="h-full bg-accent"
            data-carousel-progress
            animate={{
              width: `${((index + 1) / TOTAL) * 100}%`,
            }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            style={{
              // subtle live drag feedback when looping progress is available
              opacity: dragging ? 0.85 : 1,
              transform: dragging ? `translateX(${(progress - index / TOTAL) * 4}%)` : undefined,
            }}
          />
        </div>
      </div>
    </div>
  )
}
