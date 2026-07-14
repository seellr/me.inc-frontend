'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { fadeUp, VIEWPORT } from '@/lib/motion'
import { AnimatedLine } from '@/components/ui/AnimatedLine'
import { FloatingImage } from '@/components/ui/FloatingImage'
import { MarqueeText } from '@/components/ui/MarqueeText'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { buttonVariants } from '../ui/button'
import { ArrowRightCircleIcon } from 'lucide-react'

export function IntroSection() {
  const t = useTranslations('home.intro')

  return (
    <Section className="pt-0 pb-0" spacing="none">
      <Container className="grid items-center gap-12 py-section-sm lg:grid-cols-2 lg:py-section">
        <div className="relative order-2 mx-auto h-105 w-full max-w-sm lg:order-1">
          <AnimatedLine
            d="M50 0 V90"
            viewBox="0 0 100 90"
            className="absolute inset-x-0 -top-27 mx-auto h-56 w-full"
            strokeWidth={1.5}
          />
          <FloatingImage src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80&fit=crop" alt={t('floatingAlt')} range={35} className="absolute inset-0" />
        </div>

        <motion.div
          className="order-1 lg:order-2"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <p className="text-[clamp(24px,3vw,36px)] font-medium leading-normal text-ink-soft">
            {t('body')}
          </p>
          <Link href="/products" className={buttonVariants({ size: 'lg' }) + ' mt-4'}>
            {t('cta')}
            <ArrowRightCircleIcon />
          </Link>
        </motion.div>
      </Container>

      <MarqueeText text={t('marquee')} />
    </Section>
  )
}
