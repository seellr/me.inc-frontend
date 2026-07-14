'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, SearchX } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OrderStatusTimeline } from '@/components/commerce/OrderStatusTimeline'
import { findOrder } from '@/lib/orders'
import type { Order } from '@/types/commerce'

type Status = 'idle' | 'loading' | 'found' | 'not_found'

export default function OrderLookupPage() {
  const t = useTranslations('orderLookup')
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [order, setOrder] = useState<Order | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => {
      const result = findOrder(orderNumber, email)
      setOrder(result)
      setStatus(result ? 'found' : 'not_found')
    }, 500)
  }

  return (
    <Section as="div" className="section-y">
      <Container className="mx-auto max-w-2xl">
        <h1 className="heading-2 mb-2 text-center">{t('heading')}</h1>
        <p className="body mb-8 text-center">{t('body')}</p>

        <Card variant="static">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
            <Input
              required
              placeholder={t('orderNumber')}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <Input
              required
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="shrink-0" disabled={status === 'loading'}>
              <Search /> {t('submit')}
            </Button>
          </form>
        </Card>

        {status === 'loading' && <p className="caption mt-6 text-center">{t('loading')}</p>}

        {status === 'not_found' && (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">{t('notFoundTitle')}</p>
            <p className="caption">{t('notFoundBody')}</p>
          </div>
        )}

        {status === 'found' && order && (
          <Card variant="static" className="mt-10">
            <p className="mb-6 text-sm text-muted-foreground">
              {t('orderNumber')}: <span className="font-semibold text-foreground">{order.number}</span>
            </p>
            <OrderStatusTimeline order={order} />
          </Card>
        )}
      </Container>
    </Section>
  )
}
