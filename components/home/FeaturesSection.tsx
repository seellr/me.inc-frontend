'use client'

import { Check, Zap, Globe, MessageCircle, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion'

const FEATURES = [
  {
    icon: Zap,
    title: 'توصيل فوري',
    body: 'منتجك الرقمي يصلك على بريدك خلال ثوانٍ من إتمام الدفع — بلا انتظار.',
  },
  {
    icon: Globe,
    title: 'خدمة بلا حدود',
    body: 'اشترِ من أي مكان في العالم، بوسائل دفع محلية وعالمية تناسبك.',
  },
  {
    icon: MessageCircle,
    title: 'تواصل شخصي',
    body: 'فريق دعم عربي حقيقي يرد عليك، وليس روبوت محادثة يدور في حلقة.',
  },
  {
    icon: Award,
    title: 'خبرة في كل مجال',
    body: 'صنّاع محتوى متخصصون في التسويق والتصميم والبرمجة وريادة الأعمال.',
  },
]

const CHECKLIST = ['أكثر من ٥٠ علامة تجارية', 'منتجات بمراجعة يدوية', 'ضمان استرداد ١٤ يوم']

export function FeaturesSection() {
  return (
    <section className="bg-cream px-4 py-24 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        {/* Dark card */}
        <motion.div
          className="flex flex-col justify-between rounded-2xl bg-card-dark p-8 sm:p-10"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight text-white">
              اكتشف شبكتنا العالمية
            </h2>
            <ul className="mt-8 space-y-4">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="size-3.5 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="mailto:hello@seellr.com"
            className="mt-10 text-sm font-medium text-brand transition-colors hover:text-white"
          >
            hello@seellr.com
          </a>
        </motion.div>

        {/* 2×2 feature grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:col-span-2"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger()}
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp} className="rounded-2xl bg-white/60 p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10">
                <feature.icon className="size-6 text-brand" />
              </span>
              <h3 className="mt-5 font-body text-lg font-bold text-ink-soft">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6B7280]">{feature.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
