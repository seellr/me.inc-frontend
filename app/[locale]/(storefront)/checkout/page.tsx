'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, MapPin, CreditCard, ClipboardList, Truck, ShieldCheck, Package } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriceSummary } from '@/components/commerce/PriceSummary'
import { JourneyProgress } from '@/components/commerce/JourneyProgress'
import { FunnelModals } from '@/components/commerce/FunnelModals'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { Address } from '@/types/commerce'

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

type FieldErrors = Partial<Record<keyof Address | 'email', string>>

function validate(address: Address, email: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!address.fullName.trim()) errors.fullName = 'Required'
  if (!email.trim()) errors.email = 'Required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email'
  if (!address.phone.trim()) errors.phone = 'Required'
  else if (!/^\+?[\d\s\-()]{7,}$/.test(address.phone)) errors.phone = 'Invalid phone number'
  if (!address.line1.trim()) errors.line1 = 'Required'
  if (!address.city.trim()) errors.city = 'Required'
  if (!address.country.trim()) errors.country = 'Required'
  if (!address.postalCode.trim()) errors.postalCode = 'Required'
  return errors
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tCart = useTranslations('cart')
  const locale = useLocale()
  const router = useRouter()
  const { items, subtotal, clear } = useCart()

  const JOURNEY_STEP: Record<Step, 'shipping' | 'payment' | 'confirmation'> = {
    shipping: 'shipping',
    payment: 'payment',
    review: 'confirmation',
  }

  const [step, setStep] = useState<Step>('shipping')
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isPlacing, setIsPlacing] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)
  const [funnelOpen, setFunnelOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [placedOrderUlid, setPlacedOrderUlid] = useState<string | null>(null)

  if (items.length === 0 && !funnelOpen) {
    return (
      <Section as="div" className="section-y">
        <Container className="text-center">
          <p className="body">{tCart('emptyTitle')}</p>
          <Button render={<Link href="/products" />} className="mt-4">
            {tCart('continueShopping')}
          </Button>
        </Container>
      </Section>
    )
  }

  function tryAdvanceShipping() {
    const errors = validate(address, email)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setStep('payment')
  }

  function tryAdvancePayment() {
    setStep('review')
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true)
    setPlaceError(null)
    try {
      const loc = typeof document !== 'undefined' ? document.documentElement.lang : locale

      // Sync local cart items to backend cart
      for (const item of items) {
        await fetch('/api/customer/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-locale': loc },
          body: JSON.stringify({ product_ulid: item.productId, quantity: item.quantity, brand_id: 1 }),
        })
      }

      // Place order
      const orderRes = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'x-locale': loc },
        body: JSON.stringify({
          brand_id: 1,
          payment_method: 4,
          coupon_code: appliedCoupon?.code ?? null,
          shipping_address: {
            full_name: address.fullName,
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            country: address.country,
            postal_code: address.postalCode,
            phone: address.phone,
            email,
          },
        }),
      })

      if (orderRes.status === 401) {
        // Guest checkout — proceed to funnel without order
        setFunnelOpen(true)
        setIsPlacing(false)
        return
      }

      const orderJson = await orderRes.json()
      if (!orderRes.ok || !orderJson.success) {
        // Fall through to funnel anyway (demo mode)
        setPlaceError(null)
      } else {
        setPlacedOrderUlid(orderJson.data?.ulid ?? null)
      }

      setFunnelOpen(true)
    } catch {
      // Network error — proceed to funnel (demo mode)
      setFunnelOpen(true)
    } finally {
      setIsPlacing(false)
    }
  }

  const ctaAction =
    step === 'shipping' ? tryAdvanceShipping :
      step === 'payment' ? tryAdvancePayment :
        handlePlaceOrder

  const ctaLabel =
    step === 'shipping' ? t('shipping.continue') :
      step === 'payment' ? t('payment.continue') :
        t('review.placeOrder')

  function field(name: keyof Address) {
    return {
      value: address[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress((a) => ({ ...a, [name]: e.target.value }))
        if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }))
      },
    }
  }

  async function handleFunnelFinish() {
    await clear()
    setFunnelOpen(false)
    router.push(`/${locale}/products`)
  }

  return (
    <>
      <FunnelModals open={funnelOpen} onFinish={handleFunnelFinish} />
      <Section as="div" className="section-y">
        <Container>
          <h1 className="heading-2 mb-2">{t('title')}</h1>
          <JourneyProgress current={JOURNEY_STEP[step]} />

          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {step === 'shipping' && (
                  <motion.div
                    key="shipping"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <Card className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                        <p className="text-lg font-semibold">{t('shipping.heading')}</p>
                        <MapPin className="ms-auto size-4 text-muted-foreground" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('shipping.fullName')}</label>
                          <Input
                            placeholder="John Doe"
                            {...field('fullName')}
                            className={fieldErrors.fullName ? 'border-destructive' : ''}
                          />
                          {fieldErrors.fullName && <p className="text-xs text-destructive">{fieldErrors.fullName}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((fe) => ({ ...fe, email: undefined })) }}
                            className={fieldErrors.email ? 'border-destructive' : ''}
                          />
                          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                        </div>

                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('shipping.phone')}</label>
                          <Input
                            type="tel"
                            placeholder="+1 555 000 0000"
                            {...field('phone')}
                            className={fieldErrors.phone ? 'border-destructive' : ''}
                          />
                          {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
                        </div>

                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('shipping.address')}</label>
                          <Input
                            placeholder="123 Main St"
                            {...field('line1')}
                            className={fieldErrors.line1 ? 'border-destructive' : ''}
                          />
                          {fieldErrors.line1 && <p className="text-xs text-destructive">{fieldErrors.line1}</p>}
                        </div>

                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <Input
                            placeholder={t('shipping.addressLine2')}
                            {...field('line2')}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('shipping.city')}</label>
                          <Input
                            placeholder="New York"
                            {...field('city')}
                            className={fieldErrors.city ? 'border-destructive' : ''}
                          />
                          {fieldErrors.city && <p className="text-xs text-destructive">{fieldErrors.city}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('shipping.country')}</label>
                          <Input
                            placeholder="United States"
                            {...field('country')}
                            className={fieldErrors.country ? 'border-destructive' : ''}
                          />
                          {fieldErrors.country && <p className="text-xs text-destructive">{fieldErrors.country}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('shipping.postalCode')}</label>
                          <Input
                            placeholder="10001"
                            {...field('postalCode')}
                            className={fieldErrors.postalCode ? 'border-destructive' : ''}
                          />
                          {fieldErrors.postalCode && <p className="text-xs text-destructive">{fieldErrors.postalCode}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                        <Truck className="size-4 shrink-0 text-primary" />
                        <span>Free delivery on all orders</span>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <Card className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                        <p className="text-lg font-semibold">{t('payment.heading')}</p>
                        <CreditCard className="ms-auto size-4 text-muted-foreground" />
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment method</label>
                        <label className="flex cursor-pointer items-start gap-4 rounded-xl border-2 border-primary bg-primary/5 p-4 transition-colors">
                          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary">
                            <div className="size-2 rounded-full bg-white" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-foreground">Cash on Delivery</span>
                            <span className="text-sm text-muted-foreground">{t('payment.codOnly')}</span>
                          </div>
                          <span className="ms-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">COD</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                        <ShieldCheck className="size-4 shrink-0 text-primary" />
                        <span>{t('payment.securityNote')}</span>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {step === 'review' && (
                  <motion.div
                    key="review"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <Card className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                        <p className="text-lg font-semibold">{t('review.heading')}</p>
                        <ClipboardList className="ms-auto size-4 text-muted-foreground" />
                      </div>

                      {/* Items */}
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <Package className="size-3.5" /> Items ({items.length})
                        </p>
                        {items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                            </div>
                            <span className="text-sm font-semibold tabular-nums">{formatCurrency(item.price * item.quantity, locale)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="h-px bg-border" />

                      {/* Address */}
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="size-3.5" /> Shipping address
                        </p>
                        <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                          <p className="font-medium text-foreground">{address.fullName}</p>
                          <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                          <p>{address.city}, {address.country} {address.postalCode}</p>
                          <p>{address.phone} · {email}</p>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                          <CreditCard className="size-3.5" /> Payment
                        </p>
                        <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-4 py-3 text-sm">
                          <CheckCircle2 className="size-4 text-primary" />
                          <span>Cash on Delivery</span>
                        </div>
                      </div>

                      {placeError && <p className="text-sm text-destructive">{placeError}</p>}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step indicator dots */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {(['shipping', 'payment', 'review'] as Step[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (s === 'shipping') setStep('shipping')
                      if (s === 'payment' && (step === 'review')) setStep('payment')
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-primary' : 'w-3 bg-border'}`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <PriceSummary
                subtotal={subtotal}
                shipping={SHIPPING_ESTIMATE}
                ctaLabel={isPlacing ? '...' : ctaLabel}
                onCta={ctaAction}
                disabled={isPlacing}
                onCouponChange={setAppliedCoupon}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
