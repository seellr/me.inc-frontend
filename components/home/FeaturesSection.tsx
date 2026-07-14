'use client'

import { useTranslations } from 'next-intl'
import { Check, Zap, Globe, MessageCircle, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'

const FEATURE_ICONS = [Zap, Globe, MessageCircle, Award]

export function FeaturesSection() {
  const t = useTranslations('home.features')
  const checklist = t.raw('checklist') as string[]
  const items = t.raw('items') as { title: string; body: string }[]

  return (
    <Section>
      <Container className="grid gap-6 lg:grid-cols-3">
        {/* Dark card */}
        <motion.div
          className="flex flex-col justify-center rounded-2xl bg-card-dark p-8 sm:p-10"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight text-ink">
              {t('heading')}
            </h2>
            <ul className="mt-8 space-y-4">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="size-3.5 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* 2×2 feature grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:col-span-2"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger()}
        >
          {items.map((feature, i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <motion.div key={feature.title} variants={fadeUp} className="rounded-2xl bg-surface-tint p-7">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10">
                  <Icon className="size-6 text-brand" />
                </span>
                <h3 className="mt-5 font-body text-lg font-bold text-ink-soft">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#6B7280]">{feature.body}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </Section>
  )
}
