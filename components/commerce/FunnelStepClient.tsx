'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/currency'
import { customerFetchClient } from '@/lib/customer/api-client'
import type { FunnelNextStep } from '@/types/dto/funnel-flow.dto'

function useCountdown(minutes: number | null) {
  const [secondsLeft, setSecondsLeft] = useState(minutes ? minutes * 60 : 0)

  useEffect(() => {
    if (!minutes) return
    setSecondsLeft(minutes * 60)
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [minutes])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function FunnelStepClient({ orderUlid, initialStep }: { orderUlid: string; initialStep: FunnelNextStep }) {
  const t = useTranslations('checkout.funnel')
  const locale = useLocale()
  const [step, setStep] = useState(initialStep)
  const [isPending, setIsPending] = useState(false)
  const countdown = useCountdown(step.timer_minutes)

  useEffect(() => {
    setStep(initialStep)
  }, [initialStep])

  const price = step.price !== null ? Number(step.price) : null
  const originalPrice = step.original_price !== null ? Number(step.original_price) : null
  const discountPercent = useMemo(() => {
    if (price === null || originalPrice === null || originalPrice <= 0) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }, [price, originalPrice])

  const COMPLETE: FunnelNextStep = { step: 'complete', order_ulid: orderUlid, product: null, price: null, original_price: null, timer_minutes: null, headline: null }

  async function decide(accepted: boolean) {
    setIsPending(true)
    try {
      if (orderUlid === 'demo') {
        await new Promise((r) => setTimeout(r, 500))
        if (step.step === 'oto' && accepted) {
          // OTO accepted → show downsell as bonus confirmation then complete
          setStep(COMPLETE)
        } else {
          setStep(COMPLETE)
        }
        return
      }
      const path = step.step === 'oto' ? 'oto/decide' : 'downsell/decide'
      const result = await customerFetchClient<FunnelNextStep>(`/funnel/${orderUlid}/${path}`, {
        method: 'POST',
        body: JSON.stringify({ accepted }),
      })
      setStep(result.ok ? result.data : COMPLETE)
    } finally {
      setIsPending(false)
    }
  }

  if (step.step === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="static" className="mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
          <CheckCircle2 className="size-14 text-primary" />
          <h1 className="text-2xl font-bold">{t('complete.heading')}</h1>
          <Button nativeButton={false} render={<Link href="/orders/lookup" />} size="lg">
            {t('complete.trackOrder')}
          </Button>
        </Card>
      </motion.div>
    )
  }

  const isOto = step.step === 'oto'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.step + (step.product?.ulid ?? '')}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="static" className="mx-auto grid max-w-3xl overflow-hidden p-0 sm:grid-cols-2">
          <div className="relative aspect-square bg-muted sm:aspect-auto">
            {step.product?.hero_image_url ? (
              <Image
                src={step.product.hero_image_url}
                alt={step.product.name ?? ''}
                fill
                className="object-contain p-8"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5">
                <span className="font-display text-6xl font-bold text-primary/20 select-none">
                  {(step.product?.name ?? 'P').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {isOto && (
              <span className="absolute top-4 start-4 flex items-center gap-1 rounded-full bg-amber px-3 py-1 text-xs font-semibold text-amber-foreground">
                <Sparkles className="size-3.5" />
                {t('oto.badge')}
              </span>
            )}
            {discountPercent !== null && discountPercent > 0 && (
              <span className="badge-sale absolute top-4 end-4">-{discountPercent}%</span>
            )}
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-8">
            {step.timer_minutes !== null && (
              <div className="flex w-fit items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
                <Clock className="size-4" />
                {countdown}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold leading-tight">
                {step.headline ?? t(isOto ? 'oto.defaultHeadline' : 'downsell.defaultHeadline')}
              </h1>
              {step.product && <p className="text-lg font-medium text-muted-foreground">{step.product.name}</p>}
            </div>

            <div className="flex items-baseline gap-3">
              {price !== null && <span className="text-3xl font-bold">{formatCurrency(price, locale)}</span>}
              {originalPrice !== null && (
                <span className="text-base text-muted-foreground line-through">{formatCurrency(originalPrice, locale)}</span>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => decide(true)} disabled={isPending} size="lg" className="flex-1">
                {isPending ? '...' : t('accept')}
              </Button>
              <Button variant="outline" onClick={() => decide(false)} disabled={isPending} size="lg">
                {t('decline')}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
