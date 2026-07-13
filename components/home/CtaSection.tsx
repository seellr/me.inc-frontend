'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { fadeUp, slideInRight, VIEWPORT } from '@/lib/motion'
import { AnimatedLine } from '@/components/ui/AnimatedLine'
import { FloatingImage } from '@/components/ui/FloatingImage'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-28 sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <motion.h2
            className="font-display text-[clamp(48px,7vw,104px)] font-bold uppercase leading-[1.02] text-ink-soft"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
          >
            نجاحك
            <br />
            يبدأ من هنا
          </motion.h2>

          {/* Line drawing down and curving toward the floating product */}
          <AnimatedLine
            d="M6 0 V55 Q6 78 32 82 L70 88"
            viewBox="0 0 100 100"
            className="absolute -start-2 top-full hidden h-56 w-72 lg:block"
            strokeWidth={0.8}
          />
          <div className="relative mx-auto mt-10 h-64 w-64 lg:absolute lg:-bottom-72 lg:start-40 lg:mt-0">
            <FloatingImage src="/images/products/software.svg" alt="منتج رقمي" range={25} className="absolute inset-0" />
          </div>
        </div>

        <motion.div initial="hidden" whileInView="show" viewport={VIEWPORT} variants={slideInRight}>
          <p className="max-w-md text-lg leading-9 text-[#6B7280]">
            آلاف المتعلمين ورواد الأعمال العرب بدأوا رحلتهم بمنتج واحد من سيلر.
            خطوتك الأولى لا تحتاج أكثر من دقيقة — اختر مجالك، وخذ أول منتج يغيّر يومك.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink/20 px-6 text-sm font-bold text-ink-soft transition-colors hover:border-brand hover:text-brand"
          >
            ابدأ رحلتك
            <span aria-hidden className="text-base leading-none">⊙</span>
          </Link>
        </motion.div>
      </div>

      {/* Spacer so the absolutely-positioned floating image has room */}
      <div className="hidden h-72 lg:block" />
    </section>
  )
}
