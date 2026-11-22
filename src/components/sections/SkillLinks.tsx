import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './SkillLinks.css'

export const skillKey = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/\+\+/g, 'pp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

type Link = { id: string; d: string; delay: number }

const DEFAULT_TOUR = ['deep-learning', 'computer-vision', 'tensorflow']

const qa = (root: HTMLElement | null, sel: string) =>
  Array.from(root?.querySelectorAll<HTMLElement>(sel) ?? [])

function chipOf(t: EventTarget | null): HTMLElement | null {
  return t instanceof Element ? (t.closest('[data-skill]') as HTMLElement | null) : null
}

export default function SkillLinks({
  children,
  tour = DEFAULT_TOUR,
}: {
  children: ReactNode
  tour?: string[]
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const [links, setLinks] = useState<Link[]>([])
  const [inview, setInview] = useState(false)
  const current = useRef<{ skill: string; src: HTMLElement } | null>(null)
  const pinned = useRef(false)
  const touched = useRef(false)
  const timers = useRef<number[]>([])

  const stopTour = useCallback(() => {
    touched.current = true
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  const clear = useCallback(() => {
    current.current = null
    const root = wrap.current
    qa(root, '[data-skill]').forEach((c) => {
      c.removeAttribute('data-on')
      c.removeAttribute('data-dim')
    })
    qa(root, '[data-card]').forEach((c) => c.removeAttribute('data-lit'))
    setLinks([])
  }, [])

  const activate = useCallback((src: HTMLElement) => {
    const root = wrap.current
    const skill = src.dataset.skill
    if (!root || !skill) return
    current.current = { skill, src }

    const all = qa(root, '[data-skill]')
    const matches = all.filter((c) => c.dataset.skill === skill)
    const multi = matches.length > 1

    all.forEach((c) => {
      const on = c.dataset.skill === skill
      c.toggleAttribute('data-on', on)
      c.toggleAttribute('data-dim', multi && !on)
    })
    qa(root, '[data-card]').forEach((card) =>
      card.toggleAttribute('data-lit', multi && matches.some((m) => card.contains(m))),
    )

    if (!multi) {
      setLinks([])
      return
    }

    const rr = root.getBoundingClientRect()
    const pt = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      return {
        x: r.left - rr.left + r.width / 2,
        top: r.top - rr.top,
        bottom: r.bottom - rr.top,
        cy: r.top - rr.top + r.height / 2,
      }
    }
    const a = pt(src)
    const out: Link[] = []
    matches
      .filter((m) => m !== src)
      .forEach((m, i) => {
        const b = pt(m)
        let d: string
        if (Math.abs(b.cy - a.cy) < 24) {
          const lift = 46
          d = `M ${a.x} ${a.top} C ${a.x} ${a.top - lift}, ${b.x} ${b.top - lift}, ${b.x} ${b.top}`
        } else if (b.cy > a.cy) {
          const k = Math.max(60, (b.top - a.bottom) * 0.5)
          d = `M ${a.x} ${a.bottom} C ${a.x} ${a.bottom + k}, ${b.x} ${b.top - k}, ${b.x} ${b.top}`
        } else {
          const k = Math.max(60, (a.top - b.bottom) * 0.5)
          d = `M ${a.x} ${a.top} C ${a.x} ${a.top - k}, ${b.x} ${b.bottom + k}, ${b.x} ${b.bottom}`
        }
        out.push({ id: `${skill}-${i}`, d, delay: i * 0.08 })
      })
    setLinks(out)
  }, [])

  const toggle = useCallback(
    (el: HTMLElement) => {
      stopTour()
      if (pinned.current && current.current?.src === el) {
        pinned.current = false
        clear()
        return
      }
      pinned.current = true
      activate(el)
    },
    [activate, clear, stopTour],
  )

  useEffect(() => {
    const root = wrap.current
    if (!root) return
    qa(root, '[data-skill]').forEach((c, i) => {
      c.style.setProperty('--i', String(i))
      c.tabIndex = 0
      c.setAttribute('role', 'button')
    })
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setInview(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inview || reduce) return
    const root = wrap.current
    if (!root) return
    const n = qa(root, '[data-skill]').length
    let t = n * 35 + 900
    tour.forEach((key) => {
      timers.current.push(
        window.setTimeout(() => {
          if (touched.current) return
          const src = qa(root, '[data-skill]').find((c) => c.dataset.skill === key)
          if (src) activate(src)
        }, t),
      )
      t += 2000
    })
    timers.current.push(
      window.setTimeout(() => {
        if (!touched.current && !pinned.current) clear()
      }, t),
    )
    return () => {
      timers.current.forEach((x) => window.clearTimeout(x))
      timers.current = []
    }
  }, [inview, reduce, tour, activate, clear])

  useEffect(() => {
    const root = wrap.current
    if (!root) return
    const ro = new ResizeObserver(() => {
      const c = current.current
      if (c) activate(c.src)
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [activate])

  const onOver = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || pinned.current) return
    const el = chipOf(e.target)
    if (!el) return
    stopTour()
    if (el === current.current?.src) return
    activate(el)
  }
  const onOut = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || pinned.current) return
    if (!chipOf(e.target)) return
    if (chipOf(e.relatedTarget)) return
    clear()
  }
  const onClick = (e: React.MouseEvent) => {
    const el = chipOf(e.target)
    if (!el) {
      if (pinned.current) {
        pinned.current = false
        clear()
      }
      return
    }
    toggle(el)
  }
  const onFocus = (e: React.FocusEvent) => {
    const el = chipOf(e.target)
    if (!el || pinned.current) return
    stopTour()
    activate(el)
  }
  const onBlur = (e: React.FocusEvent) => {
    const el = chipOf(e.target)
    if (!el || pinned.current || chipOf(e.relatedTarget)) return
    clear()
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const el = chipOf(e.target)
    if (!el) return
    e.preventDefault()
    toggle(el)
  }

  return (
    <div
      ref={wrap}
      className="skilllinks"
      data-inview={inview}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKey}
    >
      <p className="skilllinks__hint">Select a skill to see where it&apos;s used.</p>
      {children}

      <svg className="skilllinks__svg" aria-hidden="true">
        <AnimatePresence>
          {links.map((l) => (
            <motion.g key={l.id} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <motion.path
                d={l.d}
                className="skilllinks__path"
                initial={
                  reduce
                    ? false
                    : ({ pathLength: 0, opacity: 0 } as unknown as { opacity: number })
                }
                animate={{ pathLength: 1, opacity: 1 } as unknown as { opacity: number }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: l.delay }}
              />
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>

      {!reduce &&
        links.map((l) => (
          <span
            key={`p-${l.id}`}
            className="skilllinks__pulse"
            aria-hidden="true"
            style={{ offsetPath: `path("${l.d}")`, animationDelay: `${0.7 + l.delay}s` }}
          />
        ))}
    </div>
  )
}
