'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT, withReducedMotion } from '@/lib/motion'

/** Wraps a grid of children so they fade/translate in one after another as the grid enters the viewport. */
export function StaggerGrid({
  children,
  className,
  staggerChildren = 0.08,
}: {
  children: React.ReactNode
  className?: string
  staggerChildren?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={stagger(staggerChildren)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={withReducedMotion(fadeUp, reduced)}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}
