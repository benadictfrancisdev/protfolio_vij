import type { ProjectVisual as VisualType } from '@/data/projects'
import { cn } from '@/lib/utils'

export function ProjectVisual({
  variant,
  className,
}: {
  variant: VisualType
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070709]',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {variant === 'medical' && <Medical />}
      {variant === 'detection' && <Detection />}
      {variant === 'sensor' && <Sensor />}
      {variant === 'security' && <Security />}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  )
}

function Medical() {
  const cells = [
    { cx: 110, cy: 110, r: 34 },
    { cx: 210, cy: 80, r: 26 },
    { cx: 300, cy: 130, r: 40 },
    { cx: 160, cy: 205, r: 30 },
    { cx: 285, cy: 220, r: 24 },
  ]
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Abstract histopathology image classification illustration">
      <defs>
        <radialGradient id="cell" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#c8ff00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c8ff00" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {cells.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill="url(#cell)" stroke="#c8ff00" strokeOpacity="0.4" />
          <circle cx={c.cx} cy={c.cy} r={c.r * 0.45} fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeDasharray="3 4" />
          <rect x={c.cx - c.r - 6} y={c.cy - c.r - 6} width={(c.r + 6) * 2} height={(c.r + 6) * 2} fill="none" stroke="#c8ff00" strokeOpacity="0.45" strokeDasharray="4 5" />
        </g>
      ))}
      <rect x="0" y="0" width="400" height="1.5" fill="#c8ff00" fillOpacity="0.5">
        <animate attributeName="y" from="0" to="300" dur="3.4s" repeatCount="indefinite" />
      </rect>
      <text x="24" y="34" fill="#ffffff" fillOpacity="0.5" fontFamily="monospace" fontSize="10" letterSpacing="2">CLASS 03 / 05</text>
      <text x="24" y="284" fill="#c8ff00" fontFamily="monospace" fontSize="10" letterSpacing="2">HISTOPATHOLOGY</text>
    </svg>
  )
}

function Detection() {
  const boxes = [
    { x: 42, y: 62, w: 110, h: 92, label: 'obj 0.92' },
    { x: 192, y: 42, w: 92, h: 120, label: 'obj 0.87' },
    { x: 252, y: 182, w: 108, h: 70, label: 'obj 0.78' },
    { x: 92, y: 182, w: 82, h: 80, label: 'obj 0.64' },
  ]
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Abstract object detection illustration with bounding boxes">
      <circle cx="97" cy="108" r="36" fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.14" />
      <rect x="214" y="66" width="52" height="78" fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.14" />
      <path d="M270 205 l42 -22 l30 42 l-36 30 z" fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.14" />
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke="#c8ff00" strokeOpacity="0.8" />
          <rect x={b.x} y={b.y - 14} width="56" height="14" fill="#c8ff00" />
          <text x={b.x + 4} y={b.y - 4} fill="#000000" fontFamily="monospace" fontSize="8">
            {b.label}
          </text>
        </g>
      ))}
      <line x1="200" y1="0" x2="200" y2="300" stroke="#ffffff" strokeOpacity="0.05" />
      <line x1="0" y1="150" x2="400" y2="150" stroke="#ffffff" strokeOpacity="0.05" />
      <text x="24" y="284" fill="#c8ff00" fontFamily="monospace" fontSize="10" letterSpacing="2">OBJECT DETECTION</text>
    </svg>
  )
}

function Sensor() {
  const path =
    'M0 165 L30 150 L60 168 L90 138 L120 158 L150 146 L180 162 L208 150 L224 58 L240 150 L270 156 L300 140 L330 168 L360 150 L400 162'
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Abstract industrial sensor anomaly waveform illustration">
      <defs>
        <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.55" stopColor="#c8ff00" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#ffffff" strokeOpacity="0.05" />
      ))}
      <path d={path} fill="none" stroke="url(#wave)" strokeWidth="2" />
      <circle cx="224" cy="58" r="4" fill="#c8ff00">
        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="224" cy="58" r="12" fill="none" stroke="#c8ff00" strokeOpacity="0.5">
        <animate attributeName="r" values="10;26;10" dur="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="232" y="46" fill="#c8ff00" fontFamily="monospace" fontSize="9">ANOMALY</text>
      <text x="24" y="284" fill="#c8ff00" fontFamily="monospace" fontSize="10" letterSpacing="2">SENSOR STREAM</text>
    </svg>
  )
}

function Security() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Abstract cybersecurity zero-day intelligence illustration">
      <defs>
        <pattern id="hex" width="26" height="30" patternUnits="userSpaceOnUse">
          <path d="M13 0 L26 7.5 L26 22.5 L13 30 L0 22.5 L0 7.5 Z" fill="none" stroke="#ffffff" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#hex)" />
      <path
        d="M200 66 L262 98 L262 160 C262 202 232 228 200 242 C168 228 138 202 138 160 L138 98 Z"
        fill="none"
        stroke="#c8ff00"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <rect x="186" y="140" width="28" height="24" rx="4" fill="#c8ff00" fillOpacity="0.85" />
      <path d="M192 140 v-7 a8 8 0 0 1 16 0 v7" fill="none" stroke="#c8ff00" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1="30" y1={64 + i * 18} x2={124 - i * 22} y2={64 + i * 18} stroke="#ffffff" strokeOpacity="0.15" />
      ))}
      <text x="24" y="284" fill="#c8ff00" fontFamily="monospace" fontSize="10" letterSpacing="2">ZERO-DAY INTEL</text>
    </svg>
  )
}
