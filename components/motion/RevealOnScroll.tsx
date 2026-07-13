'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { fadeUp, VIEWPORT, withReducedMotion } from '@/lib/motion'

/** Fades + translates a block into view once, on scroll. Falls back to a plain fade under prefers-reduced-motion. */
export function RevealOnScroll({
  children,
  variants = fadeUp,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  variants?: Variants
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={withReducedMotion(variants, reduced)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
