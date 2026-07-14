'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { fadeUp, slideInRight, VIEWPORT } from '@/lib/motion'
import { AnimatedLine } from '@/components/ui/AnimatedLine'
import { FloatingImage } from '@/components/ui/FloatingImage'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { ArrowRightCircleIcon } from 'lucide-react'
import { buttonVariants } from '../ui/button'

export function CtaSection() {
  const t = useTranslations('home.cta')

  return (
    <Section surface="tint" className="relative overflow-hidden">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <motion.h2
            className="font-display text-[clamp(48px,7vw,104px)] font-bold uppercase leading-[1.02] text-ink-soft"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
          >
            {t('headingLine1')}
            <br />
            {t('headingLine2')}
          </motion.h2>

          {/* Line drawing down and curving toward the floating product */}
          <AnimatedLine
            d="M6 0 V55 Q6 78 32 82 L70 88"
            viewBox="0 0 100 100"
            className="absolute -start-2 top-full hidden h-56 w-72 lg:block"
            strokeWidth={1}
          />
          <div className="relative mx-auto mt-10 h-64 w-64 lg:absolute lg:-bottom-72 lg:start-40 lg:mt-0">
            <FloatingImage src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80&fit=crop" alt={t('floatingAlt')} range={25} className="absolute inset-0" />
          </div>
        </div>

        <motion.div initial="hidden" whileInView="show" viewport={VIEWPORT} variants={slideInRight}>
          <p className="max-w-md text-lg leading-9 text-[#6B7280]">
            {t('body')}
          </p>
          <Link href="/products" className={buttonVariants({ variant: 'default', size: 'lg' }) + ' mt-8'}>
            {t('cta')}
            <ArrowRightCircleIcon />
          </Link>
        </motion.div>
      </Container>

      {/* Spacer so the absolutely-positioned floating image has room */}
      <div className="hidden h-72 lg:block" />
    </Section>
  )
}
