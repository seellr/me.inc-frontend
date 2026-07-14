'use client'

import { motion, useReducedMotion } from 'framer-motion'

export function MarqueeText({ text, color = '#0D9488' }: { text: string; color?: string }) {
  const reduced = useReducedMotion()

  return (
    <div className="overflow-hidden py-4" dir="ltr">
      <motion.div
        className="flex whitespace-nowrap font-display text-[8vw] font-bold uppercase"
        style={{ color }}
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
      >
        {[...Array(reduced ? 1 : 4)].map((_, i) => (
          <span key={i} className="px-8">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
