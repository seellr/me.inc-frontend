'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { customerFetchClient } from '@/lib/customer/api-client'
import type { FunnelNextStep } from '@/types/dto/funnel-flow.dto'

export function FunnelStepClient({ orderUlid, initialStep }: { orderUlid: string; initialStep: FunnelNextStep }) {
  const t = useTranslations('checkout.funnel')
  const router = useRouter()
  const [step, setStep] = useState(initialStep)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    setStep(initialStep)
  }, [initialStep])

  async function decide(accepted: boolean) {
    setIsPending(true)
    try {
      const path = step.step === 'oto' ? 'oto/decide' : 'downsell/decide'
      const result = await customerFetchClient<FunnelNextStep>(`/funnel/${orderUlid}/${path}`, {
        method: 'POST',
        body: JSON.stringify({ accepted }),
      })
      if (result.ok) {
        setStep(result.data)
      } else {
        router.push(`/orders/lookup`)
      }
    } finally {
      setIsPending(false)
    }
  }

  if (step.step === 'complete') {
    return (
      <Card variant="static" className="mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center">
        <CheckCircle2 className="size-14 text-primary" />
        <h1 className="text-xl font-semibold">{t('complete.heading')}</h1>
        <Button render={<Link href="/orders/lookup" />}>{t('complete.trackOrder')}</Button>
      </Card>
    )
  }

  return (
    <Card variant="static" className="mx-auto flex max-w-lg flex-col gap-4 p-8">
      <h1 className="text-xl font-semibold">{step.headline ?? t(step.step === 'oto' ? 'oto.defaultHeadline' : 'downsell.defaultHeadline')}</h1>
      {step.product && <p className="text-lg font-medium">{step.product.name}</p>}
      <div className="flex items-baseline gap-2">
        {step.price !== null && <span className="text-2xl font-bold">{step.price}</span>}
        {step.original_price !== null && (
          <span className="text-sm text-muted-foreground line-through">{step.original_price}</span>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={() => decide(true)} disabled={isPending}>
          {isPending ? '...' : t('accept')}
        </Button>
        <Button variant="outline" onClick={() => decide(false)} disabled={isPending}>
          {t('decline')}
        </Button>
      </div>
    </Card>
  )
}
