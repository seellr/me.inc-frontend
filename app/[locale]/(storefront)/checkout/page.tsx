'use client'

import { useMemo, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  ClipboardList,
  Truck,
  ShieldCheck,
  Package,
  Wallet,
  Banknote,
} from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PriceSummary } from '@/components/commerce/PriceSummary'
import { JourneyProgress } from '@/components/commerce/JourneyProgress'
import { formatMoney } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import { createOrder, payOrder } from '@/lib/orders/api'
import type { Address, PaymentMethodId } from '@/types/commerce'
import { PAYMENT_METHOD } from '@/types/commerce'

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

type FieldErrors = Partial<Record<keyof Address, string>>

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

const PAYMENT_METHODS: Array<{
  id: PaymentMethodId
  labelKey: string
  icon: typeof CreditCard
}> = [
  { id: PAYMENT_METHOD.PAYMOB_CARD, labelKey: 'methods.paymobCard', icon: CreditCard },
  { id: PAYMENT_METHOD.PAYMOB_WALLET, labelKey: 'methods.paymobWallet', icon: Wallet },
  { id: PAYMENT_METHOD.STRIPE, labelKey: 'methods.stripe', icon: CreditCard },
  { id: PAYMENT_METHOD.COD, labelKey: 'methods.cod', icon: Banknote },
]

function validateShipping(address: Address): FieldErrors {
  const errors: FieldErrors = {}
  if (!address.fullName.trim()) errors.fullName = 'required'
  if (!address.phone.trim()) errors.phone = 'required'
  else if (!/^\+?[\d\s\-()]{7,}$/.test(address.phone)) errors.phone = 'invalid_phone'
  if (!address.line1.trim()) errors.line1 = 'required'
  if (!address.city.trim()) errors.city = 'required'
  if (!address.country.trim()) errors.country = 'required'
  return errors
}

function idempotencyStorageKey(orderUlid: string, method: PaymentMethodId): string {
  return `meinc_pay_key_${orderUlid}_${method}`
}

function getOrCreateIdempotencyKey(orderUlid: string, method: PaymentMethodId): string {
  if (typeof window === 'undefined') return crypto.randomUUID()
  try {
    const existing = sessionStorage.getItem(idempotencyStorageKey(orderUlid, method))
    if (existing) return existing
    const created = crypto.randomUUID()
    sessionStorage.setItem(idempotencyStorageKey(orderUlid, method), created)
    return created
  } catch {
    return crypto.randomUUID()
  }
}

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tCart = useTranslations('cart')
  const locale = useLocale()
  const router = useRouter()
  const {
    items,
    total,
    currency,
    coupon,
    isLoading,
    isAuthenticated,
    requiresShipping,
  } = useCart()

  const [step, setStep] = useState<Step>('shipping')
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(PAYMENT_METHOD.COD)
  const [isPlacing, setIsPlacing] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)
  const [retry, setRetry] = useState<{ orderUlid: string; method: PaymentMethodId } | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const submitLock = useRef(false)

  const effectiveStep: Step = !requiresShipping && step === 'shipping' ? 'payment' : step

  const journeyStep = useMemo(() => {
    if (!requiresShipping && effectiveStep === 'payment') return 'payment' as const
    return effectiveStep === 'shipping'
      ? ('shipping' as const)
      : effectiveStep === 'payment'
        ? ('payment' as const)
        : ('confirmation' as const)
  }, [effectiveStep, requiresShipping])

  if (isLoading) {
    return (
      <Section as="div" className="section-y">
        <Container>
          <h1 className="heading-2 mb-2">{t('title')}</h1>
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </Container>
      </Section>
    )
  }

  if (items.length === 0) {
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

  if (!isAuthenticated) {
    return (
      <Section as="div" className="section-y">
        <Container className="text-center">
          <h1 className="heading-2 mb-2">{t('title')}</h1>
          <p className="body">{t('loginRequired')}</p>
          <Button
            render={<Link href={{ pathname: '/login', query: { next: '/checkout' } }} />}
            className="mt-4"
          >
            {t('goToLogin')}
          </Button>
        </Container>
      </Section>
    )
  }

  function tryAdvanceShipping() {
    if (!requiresShipping) {
      setStep('payment')
      return
    }
    const errors = validateShipping(address)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setStep('payment')
  }

  function mapBackendErrors(errors: Record<string, string[]> | null): FieldErrors {
    if (!errors) return {}
    const mapped: FieldErrors = {}
    const assign = (key: keyof Address, candidates: string[]) => {
      const value = candidates.flatMap((candidate) => errors[candidate] ?? [])[0]
      if (value) mapped[key] = value
    }
    assign('fullName', ['shipping_name', 'full_name'])
    assign('phone', ['shipping_phone', 'phone'])
    assign('line1', ['shipping_address', 'address', 'line1'])
    assign('city', ['shipping_city', 'city'])
    assign('country', ['shipping_country', 'country'])
    return mapped
  }

  async function startPayment(orderUlid: string, method: PaymentMethodId) {
    const key = getOrCreateIdempotencyKey(orderUlid, method)
    const payResult = await payOrder(orderUlid, key, method)

    if (!payResult.ok) {
      if (payResult.status === 429) {
        setPlaceError(t('errors.throttled'))
      } else {
        setPlaceError(payResult.message)
      }
      setRetry({ orderUlid, method })
      return
    }

    if (payResult.data.redirect_url) {
      setRedirectUrl(payResult.data.redirect_url)
      window.location.assign(payResult.data.redirect_url)
      return
    }

    // Some providers return a full iframe URL in iframe_token.
    if (payResult.data.iframe_token && /^https?:\/\//i.test(payResult.data.iframe_token)) {
      window.location.assign(payResult.data.iframe_token)
      return
    }

    // client_secret (Stripe) and raw iframe tokens are confirmed only by
    // polling the order; the order page does that every 2s.
    router.push(`/orders/${orderUlid}`)
  }

  const handlePlaceOrder = async () => {
    if (isPlacing || submitLock.current) return
    submitLock.current = true
    setIsPlacing(true)
    setPlaceError(null)

    try {
      const orderResult = await createOrder({
        payment_method: paymentMethod,
        ...(coupon?.code ? { coupon_code: coupon.code } : {}),
        ...(requiresShipping
          ? {
              shipping_name: address.fullName.trim(),
              shipping_phone: address.phone.trim(),
              shipping_address: [address.line1.trim(), address.line2?.trim()]
                .filter(Boolean)
                .join(', '),
              shipping_city: address.city.trim(),
              shipping_country: address.country.trim(),
            }
          : {}),
      })

      if (!orderResult.ok) {
        if (orderResult.status === 422) {
          setFieldErrors(mapBackendErrors(orderResult.errors))
          setPlaceError(t('errors.validation'))
        } else if (orderResult.status === 429) {
          setPlaceError(t('errors.throttled'))
        } else if (orderResult.status === 409) {
          setPlaceError(t('errors.cartLocked'))
        } else if (orderResult.errorCode === 'cart_empty' || orderResult.errorCode === 'checkout_cart_empty') {
          setPlaceError(t('review.cartEmpty'))
        } else if (orderResult.errorCode === 'product_not_purchasable') {
          setPlaceError(tCart('itemUnavailable'))
        } else {
          setPlaceError(orderResult.message)
        }
        return
      }

      const orderUlid = orderResult.data?.ulid
      if (!orderUlid) {
        setPlaceError(t('errors.orderMissing'))
        return
      }

      if (paymentMethod === PAYMENT_METHOD.COD) {
        router.push(`/funnel/${orderUlid}`)
        return
      }

      await startPayment(orderUlid, paymentMethod)
    } catch {
      setPlaceError(t('errors.network'))
    } finally {
      submitLock.current = false
      setIsPlacing(false)
    }
  }

  async function retryPayment() {
    if (!retry || isPlacing) return
    setIsPlacing(true)
    setPlaceError(null)
    try {
      await startPayment(retry.orderUlid, retry.method)
    } finally {
      setIsPlacing(false)
    }
  }

  const ctaAction =
    effectiveStep === 'shipping'
      ? tryAdvanceShipping
      : effectiveStep === 'payment'
        ? () => setStep('review')
        : retry
          ? retryPayment
          : handlePlaceOrder

  const ctaLabel =
    effectiveStep === 'shipping'
      ? t('shipping.continue')
      : effectiveStep === 'payment'
        ? t('payment.continue')
        : isPlacing
          ? t('review.placing')
          : retry
            ? t('review.retryPayment')
            : t('review.placeOrder')

  function field(name: keyof Address) {
    return {
      value: address[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress((current) => ({ ...current, [name]: e.target.value }))
        if (fieldErrors[name]) setFieldErrors((current) => ({ ...current, [name]: undefined }))
      },
    }
  }

  function fieldError(name: keyof Address): string | null {
    const code = fieldErrors[name]
    if (!code) return null
    if (code === 'required') return t('errors.required')
    if (code === 'invalid_phone') return t('errors.invalidPhone')
    return code
  }

  const selectedMethod = PAYMENT_METHODS.find((method) => method.id === paymentMethod)

  return (
    <Section as="div" className="section-y">
      <Container>
        <h1 className="heading-2 mb-2">{t('title')}</h1>
        <JourneyProgress current={journeyStep} />

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {effectiveStep === 'shipping' && (
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
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        1
                      </span>
                      <p className="text-lg font-semibold">{t('shipping.heading')}</p>
                      <MapPin className="ms-auto size-4 text-muted-foreground" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="shipping-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('shipping.fullName')}
                        </label>
                        <Input
                          id="shipping-name"
                          autoComplete="name"
                          {...field('fullName')}
                          aria-invalid={!!fieldErrors.fullName}
                          className={fieldErrors.fullName ? 'border-destructive' : ''}
                        />
                        {fieldError('fullName') && (
                          <p className="text-xs text-destructive">{fieldError('fullName')}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="shipping-phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('shipping.phone')}
                        </label>
                        <Input
                          id="shipping-phone"
                          type="tel"
                          autoComplete="tel"
                          {...field('phone')}
                          aria-invalid={!!fieldErrors.phone}
                          className={fieldErrors.phone ? 'border-destructive' : ''}
                        />
                        {fieldError('phone') && (
                          <p className="text-xs text-destructive">{fieldError('phone')}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label htmlFor="shipping-address" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('shipping.address')}
                        </label>
                        <Input
                          id="shipping-address"
                          autoComplete="street-address"
                          {...field('line1')}
                          aria-invalid={!!fieldErrors.line1}
                          className={fieldErrors.line1 ? 'border-destructive' : ''}
                        />
                        {fieldError('line1') && (
                          <p className="text-xs text-destructive">{fieldError('line1')}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label htmlFor="shipping-address2" className="sr-only">
                          {t('shipping.addressLine2')}
                        </label>
                        <Input
                          id="shipping-address2"
                          placeholder={t('shipping.addressLine2')}
                          autoComplete="address-line2"
                          {...field('line2')}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="shipping-city" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('shipping.city')}
                        </label>
                        <Input
                          id="shipping-city"
                          autoComplete="address-level2"
                          {...field('city')}
                          aria-invalid={!!fieldErrors.city}
                          className={fieldErrors.city ? 'border-destructive' : ''}
                        />
                        {fieldError('city') && (
                          <p className="text-xs text-destructive">{fieldError('city')}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="shipping-country" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('shipping.country')}
                        </label>
                        <Input
                          id="shipping-country"
                          autoComplete="country-name"
                          {...field('country')}
                          aria-invalid={!!fieldErrors.country}
                          className={fieldErrors.country ? 'border-destructive' : ''}
                        />
                        {fieldError('country') && (
                          <p className="text-xs text-destructive">{fieldError('country')}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="shipping-postal" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t('shipping.postalCode')}
                        </label>
                        <Input
                          id="shipping-postal"
                          autoComplete="postal-code"
                          {...field('postalCode')}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                      <Truck className="size-4 shrink-0 text-primary" />
                      <span>{t('shipping.requiredNote')}</span>
                    </div>
                  </Card>
                </motion.div>
              )}

              {effectiveStep === 'payment' && (
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
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        2
                      </span>
                      <p className="text-lg font-semibold">{t('payment.heading')}</p>
                      <CreditCard className="ms-auto size-4 text-muted-foreground" />
                    </div>

                    <fieldset className="flex flex-col gap-3">
                      <legend className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {t('payment.select')}
                      </legend>
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon
                        const checked = paymentMethod === method.id
                        return (
                          <label
                            key={method.id}
                            className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-colors ${
                              checked ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={method.id}
                              checked={checked}
                              onChange={() => setPaymentMethod(method.id)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                checked ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                              }`}
                            >
                              {checked && <span className="size-2 rounded-full bg-white" />}
                            </span>
                            <span className="flex flex-1 flex-col gap-0.5">
                              <span className="flex items-center gap-2 font-semibold text-foreground">
                                <Icon className="size-4 text-primary" />
                                {t(method.labelKey)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {t(`${method.labelKey}Hint`)}
                              </span>
                            </span>
                          </label>
                        )
                      })}
                    </fieldset>

                    <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                      <ShieldCheck className="size-4 shrink-0 text-primary" />
                      <span>{t('payment.securityNote')}</span>
                    </div>
                  </Card>
                </motion.div>
              )}

              {effectiveStep === 'review' && (
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
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        3
                      </span>
                      <p className="text-lg font-semibold">{t('review.heading')}</p>
                      <ClipboardList className="ms-auto size-4 text-muted-foreground" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Package className="size-3.5" /> {t('review.items', { count: items.length })}
                      </p>
                      {items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-4 py-3"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {t('review.quantity', { count: item.quantity })}
                            </span>
                          </div>
                          <span className="text-sm font-semibold tabular-nums">
                            {formatMoney(item.lineTotal ?? item.price, item.currency ?? currency, locale)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {requiresShipping && (
                      <>
                        <div className="h-px bg-border" />
                        <div className="flex flex-col gap-2">
                          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <MapPin className="size-3.5" /> {t('review.shippingAddress')}
                          </p>
                          <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                            <p className="font-medium text-foreground">{address.fullName}</p>
                            <p>
                              {address.line1}
                              {address.line2 ? `, ${address.line2}` : ''}
                            </p>
                            <p>
                              {address.city}, {address.country} {address.postalCode}
                            </p>
                            <p>{address.phone}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col gap-2">
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <CreditCard className="size-3.5" /> {t('review.payment')}
                      </p>
                      <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-4 py-3 text-sm">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>{selectedMethod ? t(selectedMethod.labelKey) : ''}</span>
                      </div>
                    </div>

                    {placeError && (
                      <div role="alert" className="flex flex-col gap-2">
                        <p className="text-sm text-destructive">{placeError}</p>
                        {retry && (
                          <Button variant="outline" size="sm" onClick={retryPayment} disabled={isPlacing}>
                            {t('review.retryPayment')}
                          </Button>
                        )}
                      </div>
                    )}

                    {redirectUrl && (
                      <p className="text-sm text-muted-foreground">
                        {t('review.redirecting')}{' '}
                        <a href={redirectUrl} className="text-primary underline">
                          {t('review.continuePayment')}
                        </a>
                      </p>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-center gap-2">
              {(['shipping', 'payment', 'review'] as Step[]).map((value) => {
                if (value === 'shipping' && !requiresShipping) return null
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={t(`steps.${value}`)}
                    onClick={() => {
                      if (value === 'shipping') setStep('shipping')
                      if (value === 'payment' && effectiveStep !== 'shipping') setStep('payment')
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      effectiveStep === value ? 'w-8 bg-primary' : 'w-3 bg-border'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <PriceSummary
              shipping={SHIPPING_ESTIMATE}
              ctaLabel={ctaLabel}
              onCta={ctaAction}
              disabled={isPlacing}
              showCouponInput={effectiveStep === 'shipping' || !requiresShipping}
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
