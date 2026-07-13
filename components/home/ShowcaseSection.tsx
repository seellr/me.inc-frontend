'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'
import { FloatingImage } from '@/components/ui/FloatingImage'

/* Scattered floating products, each with a different parallax range for depth */
const FLOATERS = [
  { src: '/images/products/ebook.svg', className: 'start-[4%] top-8 w-28 sm:w-40', range: 60 },
  { src: '/images/products/course.svg', className: 'end-[6%] top-16 w-32 sm:w-48', range: 30 },
  { src: '/images/products/template.svg', className: 'start-[10%] bottom-10 w-32 sm:w-44', range: 45 },
  { src: '/images/products/bundle.svg', className: 'end-[12%] bottom-4 w-24 sm:w-36', range: 70 },
]

export function ShowcaseSection() {
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-32 sm:px-8 sm:py-44">
      {FLOATERS.map((f) => (
        <FloatingImage
          key={f.src}
          src={f.src}
          alt=""
          range={f.range}
          className={`pointer-events-none absolute aspect-square opacity-90 ${f.className}`}
        />
      ))}

      <motion.div
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={stagger()}
      >
        <motion.span variants={fadeUp} className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white">
          المتجر
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="mt-6 font-display text-[clamp(44px,9vw,120px)] font-bold leading-[1.05] text-ink-soft"
        >
          منتجات رقمية
          <br />
          لكل هدف
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <motion.div whileHover={{ scale: 1.04 }}>
            <Link
              href="/products"
              className="flex h-13 items-center gap-2 rounded-full bg-amber px-8 text-base font-bold text-ink"
            >
              تفضل بالتسوق
              <span aria-hidden className="text-lg leading-none">⊙</span>
            </Link>
          </motion.div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-bold text-ink-soft transition-colors hover:text-brand"
          >
            تصفح المنتجات
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
