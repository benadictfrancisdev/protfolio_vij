import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode
  as?: 'div' | 'section' | 'h2' | 'p' | 'article'
  delay?: number
}

export function Reveal({ children, as = 'div', delay = 0, transition, ...rest }: RevealProps) {
  const Comp = motion[as]
  return (
    <Comp
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay, ...transition }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export default Reveal
