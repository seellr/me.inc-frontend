'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { EASE } from '@/lib/motion'
import { Button } from '../ui/button'

export function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const HEADLINE_LINES = t.raw('lines') as string[]

  return (
    <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-ink px-4 text-center lg:pt-32">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline preload="auto" className="h-full w-full object-cover">
          <source src="/media/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/70 to-ink" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-10 sm:gap-12 md:gap-14 lg:gap-17 2xl:gap-20">
        <h1
          className="relative w-[8ch] font-display text-[clamp(2rem,4vw,5rem)] leading-[1.05] font-extrabold uppercase tracking-[-0.03em] text-white"
          aria-label={HEADLINE_LINES.join(' ')}
        >
          {/* vertical line dropping into the headline */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-[94%] left-1/2 h-[100vh] w-[3px] -translate-x-1/2 bg-[currentColor] lg:w-[4px] xl:w-[6px]"
            style={{ transformOrigin: 'top center' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          />

          <span className="relative block">{HEADLINE_LINES[0]}</span>

          <span className="relative block">
            {/* horizontal line reaching in from the edge */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-1/2 ltr:right-[95%] rtl:left-full h-[3px] w-[100vw] -translate-y-1/2 bg-[currentColor] lg:h-[4px] xl:h-[6px]"
              style={{ transformOrigin: isRtl ? 'right center' : 'left center' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            />
            {HEADLINE_LINES[1]}
          </span>

          <span className="relative block">
            {HEADLINE_LINES[2]}
            {/* rounded corner frame threading down toward the button */}
            <span className="pointer-events-none absolute top-[0.5em] h-[100vh] w-[40vw] sm:w-[30vw] lg:w-[30vw] ltr:left-[84%] rtl:right-full rtl:scale-x-[-1]">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1088.09375 1289"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M 544.046875,1289 L 544.046875,62.5 A 60,60 0 0,0 484.046875,2.5 L 0,2.5"
                  stroke="currentColor"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: EASE }}
                />
              </svg>
            </span>
          </span>
        </h1>

        <motion.div
          className="flex flex-col items-center gap-2.5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1, ease: EASE }}
        >
          <motion.div whileHover={{ scale: 1.03 }} className="inline-block">
            <Button size='xl' nativeButton={false} render={<Link href="/products" />}>
              {t('cta')}
            </Button>
          </motion.div>
          <span className="text-lg leading-[1.5] font-[370] text-white/70">
            {t('caption')}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
