'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriceSummary } from '@/components/commerce/PriceSummary'
import { JourneyProgress } from '@/components/commerce/JourneyProgress'
import { useCart } from '@/lib/cart/context'
import { customerFetchClient } from '@/lib/customer/api-client'
import type { Address } from '@/types/commerce'
import type { Order } from '@/types/dto/order.dto'

type Step = 'shipping' | 'payment' | 'review'

const SHIPPING_ESTIMATE = 0

const EMPTY_ADDRESS: Address = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  country: '',
  postalCode: '',
  phone: '',
}

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tCart = useTranslations('cart')
  const { items, subtotal, clear, isAuthenticated } = useCart()

  const [step, setStep] = useState<Step>('shipping')
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)

  if (!isAuthenticated) {
    return (
      <Section as="div" spacing="none" className="section-y">
        <Container className="text-center">
          <p className="body">{t('loginRequired')}</p>
          <Button render={<Link href="/login" />} className="mt-4">
            {t('goToLogin')}
          </Button>
        </Container>
      </Section>
    )
  }

  if (order) {
    return (
      <Section as="div" spacing="none" className="section-y">
        <Container className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto mb-4 size-14 text-primary" />
          <h1 className="heading-2">{t('confirmation.heading')}</h1>
          <p className="body mt-2">{t('confirmation.body')}</p>
          <p className="mt-6 text-sm text-muted-foreground">{t('confirmation.orderNumber')}</p>
          <p className="text-2xl font-bold tracking-wide text-foreground">{order.invoice_number ?? order.ulid}</p>
          <Button render={<Link href="/orders/lookup" />} size="lg" className="mt-8">
            {t('confirmation.trackOrder')}
          </Button>
        </Container>
      </Section>
    )
  }

  if (items.length === 0) {
    return (
      <Section as="div" spacing="none" className="section-y">
        <Container className="text-center">
          <p className="body">{tCart('emptyTitle')}</p>
          <Button render={<Link href="/products" />} className="mt-4">
            {tCart('continueShopping')}
          </Button>
        </Container>
      </Section>
    )
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true)
    setPlaceError(null)
    try {
      // payment_method=4 (Cod). Card/Paymob/Stripe checkout (iframe redirect,
      // Stripe Elements) is a separate integration not built in this pass —
      // COD is the one path this form completes end-to-end.
      const orderResult = await customerFetchClient<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          payment_method: 4,
          shipping_name: address.fullName,
          shipping_phone: address.phone,
          shipping_address: address.line1,
          shipping_city: address.city,
          shipping_country: address.country,
        }),
      })

      if (!orderResult.ok) {
        setPlaceError(orderResult.message)
        return
      }

      const payResult = await customerFetchClient(`/orders/${orderResult.data.ulid}/pay`, {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({ method: 'cod' }),
      })

      if (!payResult.ok) {
        setPlaceError(payResult.message)
        return
      }

      await clear()
      setOrder(orderResult.data)
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <h1 className="heading-2 mb-2">{t('title')}</h1>
        <JourneyProgress current="payment" />

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="flex flex-col gap-6">
            {step === 'shipping' && (
              <Card variant="static" className="flex flex-col gap-4">
                <p className="text-lg font-semibold">{t('shipping.heading')}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    required
                    placeholder={t('shipping.fullName')}
                    value={address.fullName}
                    onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                  />
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    required
                    placeholder={t('shipping.phone')}
                    className="sm:col-span-2"
                    value={address.phone}
                    onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                  />
                  <Input
                    required
                    placeholder={t('shipping.address')}
                    className="sm:col-span-2"
                    value={address.line1}
                    onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                  />
                  <Input
                    placeholder={t('shipping.addressLine2')}
                    className="sm:col-span-2"
                    value={address.line2}
                    onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                  />
                  <Input
                    required
                    placeholder={t('shipping.city')}
                    value={address.city}
                    onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  />
                  <Input
                    required
                    placeholder={t('shipping.country')}
                    value={address.country}
                    onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                  />
                  <Input
                    required
                    placeholder={t('shipping.postalCode')}
                    value={address.postalCode}
                    onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                  />
                </div>
                <Button
                  className="self-end"
                  onClick={() => {
                    if (address.fullName && email && address.line1 && address.city && address.country && address.postalCode && address.phone) {
                      setStep('payment')
                    }
                  }}
                >
                  {t('shipping.continue')}
                </Button>
              </Card>
            )}

            {step === 'payment' && (
              <Card variant="static" className="flex flex-col gap-4">
                <p className="text-lg font-semibold">{t('payment.heading')}</p>
                <p className="body text-sm text-muted-foreground">{t('payment.codOnly')}</p>
                <p className="caption flex items-center gap-1.5">
                  <ShieldCheck className="size-4" /> {t('payment.securityNote')}
                </p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('shipping')}>
                    {t('back')}
                  </Button>
                  <Button onClick={() => setStep('review')}>{t('payment.continue')}</Button>
                </div>
              </Card>
            )}

            {step === 'review' && (
              <Card variant="static" className="flex flex-col gap-4">
                <p className="text-lg font-semibold">{t('review.heading')}</p>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>{address.fullName}</span>
                  <span>
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ''}
                  </span>
                  <span>
                    {address.city}, {address.country} {address.postalCode}
                  </span>
                  <span>{address.phone}</span>
                  <span>{email}</span>
                </div>
                {placeError && <p className="text-sm text-destructive">{placeError}</p>}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('payment')}>
                    {t('back')}
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={isPlacing}>
                    {isPlacing ? '...' : t('review.placeOrder')}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <PriceSummary
              subtotal={subtotal}
              shipping={SHIPPING_ESTIMATE}
              ctaLabel={t(step === 'review' ? 'review.placeOrder' : `${step}.continue`)}
              onCta={
                step === 'shipping'
                  ? () => setStep('payment')
                  : step === 'payment'
                    ? () => setStep('review')
                    : handlePlaceOrder
              }
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
