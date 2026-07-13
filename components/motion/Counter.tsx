'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'

/** Animates a number counting up to `value` once it scrolls into view. Jumps straight to the value under prefers-reduced-motion. */
export function Counter({
  value,
  duration = 1.2,
  suffix = '',
  prefix = '',
  className,
}: {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString())

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      motionValue.set(value)
      return
    }
    const controls = animate(motionValue, value, { duration, ease: 'easeOut' })
    return () => controls.stop()
  }, [inView, reduced, value, duration, motionValue])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
