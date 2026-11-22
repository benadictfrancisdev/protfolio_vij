import { useState } from 'react'
import type { HeroSlide } from '@/data/heroSlides'
import { cn } from '@/lib/utils'

export function SlideVisual({
  slide,
  className,
  priority = false,
}: {
  slide: HeroSlide
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070709] sm:rounded-[2rem]',
        className,
      )}
    >
      {slide.visual === 'portrait' && slide.image ? (
        <PortraitPane src={slide.image} priority={priority} />
      ) : (
        <AbstractPane kind={slide.visual} label={slide.heading} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  )
}

function PortraitPane({ src, priority }: { src: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <AbstractPane kind="portrait" label="ARTIFICIAL INTELLIGENCE" />
  }

  return (
    <img
      src={src}
      alt="Vijetha L — professional portrait"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full select-none object-cover object-[center_28%]"
    />
  )
}

function AbstractPane({
  kind,
  label,
}: {
  kind: HeroSlide['visual']
  label: string
}) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      {kind === 'vision' && <VisionArt />}
      {kind === 'neural' && <NeuralArt />}
      {kind === 'generative' && <GenerativeArt />}
      {(kind === 'portrait' || !['vision', 'neural', 'generative'].includes(kind)) && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-6xl text-accent/40">VL</span>
        </div>
      )}
      <span className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent/80">
        {label}
      </span>
      <span className="absolute bottom-5 right-5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70">
        Abstract illustration
      </span>
    </div>
  )
}

function VisionArt() {
  return (
    <svg viewBox="0 0 640 800" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="vglow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#c8ff00" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="800" fill="url(#vglow)" />
      {[
        [80, 140, 160, 130],
        [320, 100, 180, 150],
        [140, 360, 150, 140],
        [360, 420, 170, 120],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="none" stroke="#c8ff00" strokeOpacity="0.75" />
          <rect x={x} y={y - 16} width="64" height="16" fill="#c8ff00" />
          <text x={x + 6} y={y - 4} fill="#000" fontSize="10" fontFamily="monospace">
            {(0.92 - i * 0.07).toFixed(2)}
          </text>
        </g>
      ))}
      <circle cx="320" cy="400" r="90" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeDasharray="6 8" />
    </svg>
  )
}

function NeuralArt() {
  const nodes = [
    [120, 180],
    [220, 120],
    [340, 160],
    [460, 130],
    [180, 320],
    [300, 280],
    [420, 340],
    [240, 480],
    [380, 520],
    [500, 460],
  ]
  return (
    <svg viewBox="0 0 640 800" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="nglow" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#c8ff00" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="800" fill="url(#nglow)" />
      {nodes.map(([x1, y1], i) =>
        nodes.slice(i + 1).map(([x2, y2], j) => {
          const d = Math.hypot(x1 - x2, y1 - y2)
          if (d > 220) return null
          return (
            <line
              key={`${i}-${j}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#c8ff00"
              strokeOpacity={0.18}
            />
          )
        }),
      )}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 7 : 4.5} fill="#c8ff00" fillOpacity="0.85" />
      ))}
    </svg>
  )
}

function GenerativeArt() {
  return (
    <svg viewBox="0 0 640 800" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="gwave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#c8ff00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M0 ${220 + i * 70} C 160 ${160 + i * 70}, 320 ${280 + i * 70}, 480 ${200 + i * 70} S 640 ${240 + i * 70}, 640 ${240 + i * 70}`}
          fill="none"
          stroke="url(#gwave)"
          strokeWidth="1.5"
          opacity={0.35 + i * 0.1}
        />
      ))}
      <circle cx="360" cy="360" r="8" fill="#c8ff00">
        <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="360" cy="360" r="28" fill="none" stroke="#c8ff00" strokeOpacity="0.4">
        <animate attributeName="r" values="18;48;18" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
