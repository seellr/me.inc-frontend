'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, Sparkles, X, Zap, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/currency'
import { useLocale } from 'next-intl'

type Offer = {
  id: string
  badge: string
  badgeIcon: React.ReactNode
  headline: string
  sub: string
  productName: string
  price: number
  originalPrice: number
  timerMinutes?: number
  accentColor: string
}

const OFFERS: Offer[] = [
  {
    id: 'oto1',
    badge: 'One-Time Offer',
    badgeIcon: <Sparkles className="size-3.5" />,
    headline: 'Wait! Before you go…',
    sub: 'Unlock our Premium Growth Bundle — 70% off for the next 15 minutes only.',
    productName: 'Premium Growth Bundle',
    price: 29,
    originalPrice: 97,
    timerMinutes: 15,
    accentColor: 'amber',
  },
  {
    id: 'oto2',
    badge: 'Exclusive Add-On',
    badgeIcon: <Zap className="size-3.5" />,
    headline: 'Amazing choice! One more deal…',
    sub: 'Complete your toolkit with our AI Masterclass Series at 60% off.',
    productName: 'AI Masterclass Series',
    price: 19,
    originalPrice: 49,
    timerMinutes: 10,
    accentColor: 'primary',
  },
  {
    id: 'downsell',
    badge: 'Best Value',
    badgeIcon: <Gift className="size-3.5" />,
    headline: 'Last chance — our best deal',
    sub: 'Get started fast with the Quick Start Guide at an unbeatable price.',
    productName: 'Quick Start Guide',
    price: 9,
    originalPrice: 29,
    accentColor: 'primary',
  },
]

function useCountdown(minutes?: number) {
  const [secs, setSecs] = useState(minutes ? minutes * 60 : 0)
  useEffect(() => {
    if (!minutes) return
    setSecs(minutes * 60)
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [minutes])
  return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
}

function OfferModal({
  offer,
  step,
  total,
  onDecide,
}: {
  offer: Offer
  step: number
  total: number
  onDecide: (accepted: boolean) => void
}) {
  const locale = useLocale()
  const countdown = useCountdown(offer.timerMinutes)
  const discount = Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)

  return (
    <motion.div
      key={offer.id}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md rounded-3xl bg-card shadow-2xl ring-1 ring-border overflow-hidden"
    >
      {/* Progress dots */}
      <div className="absolute top-4 start-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {OFFERS.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-border'}`}
          />
        ))}
      </div>

      {/* Gradient header */}
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted">
        <div className="flex flex-col items-center gap-2 text-center px-6 pt-6">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${offer.id === 'oto1' ? 'bg-amber/20 text-amber-600' : 'bg-primary/15 text-primary'}`}>
            {offer.badgeIcon}{offer.badge}
          </span>
          <span className="text-4xl font-black text-primary/15 select-none">{offer.productName.slice(0, 2).toUpperCase()}</span>
        </div>
        {discount > 0 && (
          <span className="badge-sale absolute top-4 end-4">-{discount}%</span>
        )}
      </div>

      <div className="flex flex-col gap-5 p-6">
        {offer.timerMinutes && (
          <div className="flex items-center gap-2 self-start rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-semibold text-destructive">
            <Clock className="size-4" />
            {countdown}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold leading-tight">{offer.headline}</h2>
          <p className="text-sm text-muted-foreground">{offer.sub}</p>
        </div>

        <p className="text-sm font-medium text-foreground/70">{offer.productName}</p>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black">{formatCurrency(offer.price, locale)}</span>
          <span className="text-base text-muted-foreground line-through">{formatCurrency(offer.originalPrice, locale)}</span>
          <span className="ms-auto text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 rounded-full px-2 py-0.5">
            Save {formatCurrency(offer.originalPrice - offer.price, locale)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => onDecide(true)} className="w-full">
            Yes, add it to my order →
          </Button>
          <button
            type="button"
            onClick={() => onDecide(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            No thanks, I'll pass on this offer
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CompleteModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm rounded-3xl bg-card shadow-2xl ring-1 ring-border overflow-hidden"
    >
      <div className="flex flex-col items-center gap-5 p-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <CheckCircle2 className="size-16 text-primary" />
        </motion.div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
          <p className="text-sm text-muted-foreground">Your order has been placed successfully. We&apos;ll be in touch soon.</p>
        </div>
        <Button size="lg" onClick={onClose} className="w-full">
          Continue shopping
        </Button>
      </div>
    </motion.div>
  )
}

export function FunnelModals({
  open,
  onFinish,
}: {
  open: boolean
  onFinish: () => void
}) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) { setStep(0); setDone(false) }
  }, [open])

  function decide() {
    if (step < OFFERS.length - 1) {
      setStep((s) => s + 1)
    } else {
      setDone(true)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <OfferModal
              key={step}
              offer={OFFERS[step]}
              step={step}
              total={OFFERS.length}
              onDecide={decide}
            />
          ) : (
            <CompleteModal key="complete" onClose={onFinish} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
