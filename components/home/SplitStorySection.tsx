'use client'

import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, slideInRight, VIEWPORT } from '@/lib/motion'
import { AnimatedLine } from '@/components/ui/AnimatedLine'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function SplitStorySection() {
  return (
    <section id="story" className="relative bg-cream px-4 py-24 sm:px-8">
      {/* Curved thread connecting the two columns */}
      <AnimatedLine
        d="M10 10 C 35 90, 65 10, 90 85"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-x-0 top-8 -z-0 mx-auto hidden h-40 w-3/5 lg:block"
        strokeWidth={0.6}
      />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-5">
        {/* Editorial image with story overlay */}
        <motion.div
          className="relative h-105 overflow-hidden rounded-2xl lg:col-span-3 lg:h-130"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <Image src="/images/editorial/story.svg" alt="قصة سيلر" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 start-6 flex items-center gap-4">
            <Dialog>
              <DialogTrigger
                className="flex size-14 items-center justify-center rounded-full bg-amber text-ink transition-transform hover:scale-105"
                aria-label="شاهد الفيديو"
              >
                <Play className="size-6 fill-current" />
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-2 sm:max-w-3xl" showCloseButton>
                <DialogTitle className="sr-only">فيديو قصتنا</DialogTitle>
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-ink">
                  <iframe
                    title="قصة سيلر"
                    src="about:blank"
                    className="size-full"
                    allow="accelerometer; autoplay; encrypted-media"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <span className="font-display text-4xl font-bold text-white sm:text-5xl">قصتنا</span>
          </div>
        </motion.div>

        {/* Pink accent card */}
        <motion.div
          className="flex flex-col items-start justify-center rounded-2xl bg-card-pink p-8 sm:p-12 lg:col-span-2"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={slideInRight}
        >
          <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white">منتجاتنا</span>
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            دائمًا الاختيار الصح
          </h2>
          <p className="mt-4 leading-8 text-ink/75">
            كل منتج على سيلر يمر بمراجعة يدوية قبل نشره — نقرأ الكتاب، نشاهد الدورة، ونجرب الأداة.
            إذا وصلك منتج منا، فهو يستحق وقتك ومالك.
          </p>
          <Link
            href="/products"
            className="group mt-8 inline-flex items-center gap-2 text-base font-bold text-ink transition-colors hover:text-brand-dark"
          >
            استكشف
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
