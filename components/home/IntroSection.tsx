'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { fadeUp, VIEWPORT } from '@/lib/motion'
import { AnimatedLine } from '@/components/ui/AnimatedLine'
import { FloatingImage } from '@/components/ui/FloatingImage'
import { MarqueeText } from '@/components/ui/MarqueeText'

export function IntroSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-10 pt-24 sm:px-8 lg:grid-cols-2">
        {/* Floating product on a thin teal stem, like a flower */}
        <div className="relative order-2 mx-auto h-105 w-full max-w-sm lg:order-1">
          <AnimatedLine
            d="M50 0 V90"
            viewBox="0 0 100 90"
            className="absolute inset-x-0 -top-24 mx-auto h-56 w-full"
            strokeWidth={1.5}
          />
          <FloatingImage src="/images/products/ebook.svg" alt="منتج رقمي" range={35} className="absolute inset-0" />
        </div>

        <motion.div
          className="order-1 lg:order-2"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <p className="text-[clamp(24px,3vw,36px)] font-medium leading-normal text-ink-soft">
            سيلر منصة عربية تجمع أفضل المنتجات الرقمية في مكان واحد — من الكتاب الذي يغيّر طريقة تفكيرك،
            إلى الدورة التي تنقل مسيرتك، إلى الأداة التي توفر عليك ساعات كل يوم.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink/20 px-6 text-sm font-bold text-ink-soft transition-colors hover:border-brand hover:text-brand"
          >
            اعرف أكثر
            <span aria-hidden className="text-base leading-none">⊙</span>
          </Link>
        </motion.div>
      </div>

      <MarqueeText text="تسوق دائمًا — دائمًا تسوق" />
    </section>
  )
}
