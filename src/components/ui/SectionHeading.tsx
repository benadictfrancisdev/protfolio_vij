import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  index: string
  label: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('relative', align === 'center' && 'mx-auto text-center', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-8 font-display text-[clamp(4rem,12vw,9rem)] leading-none text-white/[0.04] select-none',
          align === 'center' ? 'left-1/2 -translate-x-1/2' : '-left-2',
        )}
      >
        {index}
      </span>

      <Reveal>
        <div className={cn('mb-6 flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="h-px w-10 bg-accent/70" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            {index} / {label}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="relative font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-[0.92] tracking-tight text-text">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              'mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
