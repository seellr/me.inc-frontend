'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export function FloatingImage({
  src,
  alt,
  className,
  range = 40,
}: {
  src: string
  alt: string
  className?: string
  /** parallax travel in px — each instance can use a different range for depth */
  range?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-range, range])

  return (
    <motion.div ref={ref} style={{ y: reduced ? 0 : y }} className={className}>
      <Image src={src} alt={alt} fill className="object-contain drop-shadow-2xl" />
    </motion.div>
  )
}
