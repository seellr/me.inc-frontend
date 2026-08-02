import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

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
    <motion.div ref={ref} style={{ y: reduced ? 0 : y }} className={cn('overflow-hidden rounded-2xl', className)}>
      <Image src={src} alt={alt} fill className="object-cover drop-shadow-2xl rounded-2xl" />
    </motion.div>
  )
}
