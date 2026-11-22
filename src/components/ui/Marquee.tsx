import { cn } from '@/lib/utils'

export function Marquee({
  items,
  className,
  separator = '✦',
}: {
  items: string[]
  className?: string
  separator?: string
}) {
  const content = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="flex items-center gap-8 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-muted"
        >
          {item}
          <span className="text-accent/70">{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={cn('group flex overflow-hidden border-y border-white/10 py-4', className)}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {content}
        {content}
      </div>
    </div>
  )
}
