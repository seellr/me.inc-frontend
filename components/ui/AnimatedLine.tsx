'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export function AnimatedLine({
  d,
  color = '#0D9488',
  strokeWidth = 2,
  className,
  viewBox,
}: {
  d: string
  color?: string
  strokeWidth?: number
  className?: string
  viewBox?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref as unknown as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  })
  const scrollPathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1])

  return (
    <svg ref={ref} className={className} viewBox={viewBox} fill="none" aria-hidden preserveAspectRatio="none">
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        style={{ pathLength: reduced ? 1 : scrollPathLength }}
        strokeLinecap="round"
      />
    </svg>
  )
}
