'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMoney } from '@/lib/currency'
import { useFunnelNextStep } from '@/hooks/useStorefront'
import { useCart } from '@/lib/cart/context'
import type { FunnelStepView } from '@/types/commerce'

function useCountdown(minutes: number | null) {
  const [secondsLeft, setSecondsLeft] = useState(minutes ? minutes * 60 : 0)

  useEffect(() => {
    if (!minutes) return
    setSecondsLeft(minutes * 60)
    const interval = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [minutes])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

function isAbsoluteUrl(value: string | null): value is string {
  return !!value && /^https?:\/\//i.test(value)
}

export function FunnelStepClient({
  orderUlid,
  initialStep,
}: {
  orderUlid: string
  initialStep: FunnelStepView | null
}) {
  const t = useTranslations('orders.funnel')
  const locale = useLocale()
  const { currency } = useCart()
  const { step, isLoading, isPending, error, throttled, decide } = useFunnelNextStep(
    orderUlid,
    initialStep,
  )
  const countdown = useCountdown(step?.timerMinutes ?? null)

  const discountPercent = useMemo(() => {
    if (!step?.price || !step?.originalPrice) return null
    const price = Number(step.price)
    const original = Number(step.originalPrice)
    if (!Number.isFinite(price) || !Number.isFinite(original) || original <= 0) return null
    return Math.round(((original - price) / original) * 100)
  }, [step?.price, step?.originalPrice])

  if (isLoading || !step) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4" aria-busy="true">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (step.step === 'complete' || step.step === 'dashboard') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
          <CheckCircle2 className="size-14 text-primary" />
          <h1 className="text-2xl font-bold">
            {step.step === 'complete' ? t('completeHeading') : t('dashboardHeading')}
          </h1>
          <Button nativeButton={false} render={<Link href={`/orders/${orderUlid}`} />} size="lg">
            {t('trackOrder')}
          </Button>
        </Card>
      </motion.div>
    )
  }

  const isOto = step.step === 'oto'
  const image = step.product?.image ?? null

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {step.paymentFailed && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{t('paymentFailed')}</span>
        </div>
      )}

      {throttled && (
        <div role="alert" className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          {t('throttled')}
        </div>
      )}

      {error && !throttled && (
        <div role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${step.step}-${step.product?.ulid ?? ''}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="grid overflow-hidden p-0 sm:grid-cols-2">
            <div className="relative aspect-square bg-muted sm:aspect-auto">
              {isAbsoluteUrl(image) ? (
                <Image src={image} alt={step.product?.name ?? ''} fill className="object-contain p-8" />
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
                  {t('otoBadge')}
                </span>
              )}
              {discountPercent !== null && discountPercent > 0 && (
                <span className="badge-sale absolute top-4 end-4">-{discountPercent}%</span>
              )}
            </div>

            <div className="flex flex-col gap-5 p-6 sm:p-8">
              {step.timerMinutes !== null && (
                <div className="flex w-fit items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
                  <Clock className="size-4" />
                  {countdown}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold leading-tight">
                  {step.headline ??
                    t(isOto ? 'otoDefaultHeadline' : 'downsellDefaultHeadline')}
                </h1>
                {step.product && (
                  <p className="text-lg font-medium text-muted-foreground">{step.product.name}</p>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                {step.price !== null && (
                  <span className="text-3xl font-bold">
                    {formatMoney(step.price, currency, locale)}
                  </span>
                )}
                {step.originalPrice !== null && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatMoney(step.originalPrice, currency, locale)}
                  </span>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={() => decide(true)}
                  disabled={isPending}
                  size="lg"
                  className="flex-1"
                >
                  {isPending ? '…' : t('accept')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => decide(false)}
                  disabled={isPending}
                  size="lg"
                >
                  {t('decline')}
                </Button>
              </div>

              <Link
                href={`/orders/${orderUlid}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {t('backToOrder')}
                <ArrowRight className="size-3 rtl:rotate-180" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
