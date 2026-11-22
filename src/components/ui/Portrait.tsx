import { PORTRAIT_SRC } from '@/data/portrait'
import { cn } from '@/lib/utils'

type Variant = 'hero' | 'about' | 'default'

export function Portrait({
  className,
  priority = false,
  variant = 'default',
}: {
  className?: string
  priority?: boolean
  variant?: Variant
}) {
  const aspect =
    variant === 'hero' ? 'aspect-[5/4]' : variant === 'about' ? 'aspect-[4/3]' : 'aspect-[5/4]'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-elevated sm:rounded-[2rem]',
        aspect,
        className,
      )}
    >
      <img
        src={PORTRAIT_SRC}
        alt="Portrait of Vijetha L"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'h-full w-full object-cover object-[center_22%] transition-transform duration-[1.4s] ease-out will-change-transform',
          'group-hover/portrait:scale-[1.04]',
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  )
}
