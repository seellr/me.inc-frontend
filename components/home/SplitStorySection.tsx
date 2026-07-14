'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRightCircleIcon, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, slideInRight, VIEWPORT } from '@/lib/motion'
import { AnimatedLine } from '@/components/ui/AnimatedLine'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { buttonVariants } from '../ui/button'

export function SplitStorySection() {
  const t = useTranslations('home.splitStory')

  return (
    <Section id="story">
      <Container className="relative">
        {/* Curved thread connecting the two columns */}
        <AnimatedLine
          d="M10 10 C 35 90, 65 10, 90 85"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-x-0 top-5 -z-0 mx-auto hidden h-30 w-3/5 lg:block"
          strokeWidth={1}
        />

        <div className="relative grid gap-6 lg:grid-cols-2">
          {/* Editorial image with story overlay */}
          <motion.div
            className="relative h-105 overflow-hidden rounded-2xl lg:col-span-1 lg:h-130"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
          >
            <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop" alt={t('storyAlt')} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 start-6 flex items-center gap-4">
              <Dialog>
                <DialogTrigger
                  className="flex size-14 items-center justify-center rounded-full bg-amber text-ink transition-transform hover:scale-105"
                  aria-label={t('watchVideo')}
                >
                  <Play className="size-6 fill-current" />
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-2 sm:max-w-3xl" showCloseButton>
                  <DialogTitle className="sr-only">{t('videoTitle')}</DialogTitle>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-foreground">
                    <iframe
                      title={t('videoTitle')}
                      src="/media/hero_video.mp4"
                      className="size-full"
                      allow="accelerometer; autoplay; encrypted-media"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <span className="font-display text-4xl font-bold text-white sm:text-5xl">{t('storyLabel')}</span>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-start justify-center rounded-2xl bg-card-pink p-8 sm:p-12 lg:col-span-1"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={slideInRight}
          >
            <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-white">{t('badge')}</span>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {t('heading')}
            </h2>
            <p className="mt-4 leading-8 text-ink/75">
              {t('body')}
            </p>
            <Link href="/products" className={buttonVariants({ size: 'lg' }) + ' mt-8'}>
              {t('cta')}
              <ArrowRightCircleIcon />
            </Link>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
