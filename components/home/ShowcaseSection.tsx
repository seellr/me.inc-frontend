'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'
import { FloatingImage } from '@/components/ui/FloatingImage'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { buttonVariants } from '../ui/button'
import { ArrowRightCircleIcon } from 'lucide-react'

/* Scattered floating products, each with a different parallax range for depth */
const FLOATERS = [
  { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80&fit=crop', className: 'start-[4%] top-8 w-28 sm:w-40', range: 60 },
  { src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&q=80&fit=crop', className: 'end-[6%] top-16 w-32 sm:w-48', range: 30 },
  { src: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&q=80&fit=crop', className: 'start-[10%] bottom-10 w-32 sm:w-44', range: 45 },
  { src: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=80&fit=crop', className: 'end-[12%] bottom-4 w-24 sm:w-36', range: 70 },
]

export function ShowcaseSection() {
  const t = useTranslations('home.showcase')

  return (
    <Section surface="tint" className="relative overflow-hidden">
      {FLOATERS.map((f) => (
        <FloatingImage
          key={f.src}
          src={f.src}
          alt=""
          range={f.range}
          className={`pointer-events-none absolute aspect-square opacity-90 ${f.className}`}
        />
      ))}

      <Container className="relative flex flex-col items-center text-center">
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger()}
        >
          <motion.span variants={fadeUp} className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-white">
            {t('badge')}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-6 font-display text-[clamp(44px,9vw,120px)] font-bold leading-[1.05] text-ink-soft"
          >
            {t('headingLine1')}
            <br />
            {t('headingLine2')}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.04 }}>
              <Link href="/products" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                {t('shopCta')}
                <ArrowRightCircleIcon />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  )
}
