'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Tag, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatMoney } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { MoneyValue } from '@/types/commerce'

export function PriceSummary({
  shipping,
  ctaLabel,
  onCta,
  ctaHref,
  disabled,
  showCouponInput = true,
}: {
  shipping: MoneyValue
  ctaLabel: string
  onCta?: () => void
  ctaHref?: string
  disabled?: boolean
  showCouponInput?: boolean
}) {
  const locale = useLocale()
  const t = useTranslations('cart')
  const {
    subtotal,
    discount,
    vat,
    vatLabel,
    total,
    coupon,
    currency,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  async function handleApply() {
    const upper = code.trim().toUpperCase()
    if (!upper || isApplying) return
    setIsApplying(true)
    setError(null)
    const result = await applyCoupon(upper)
    if (result.error) {
      if (result.error === 'coupon_not_found') {
        setError(t('invalidPromo'))
      } else if (result.error === 'coupon_not_applicable') {
        setError(t('couponNotApplicable'))
      } else if (result.error === 'cart_empty') {
        setError(t('emptyTitle'))
      } else {
        setError(result.error)
      }
    } else {
      setCode('')
    }
    setIsApplying(false)
  }

  async function handleRemove() {
    if (isRemoving) return
    setIsRemoving(true)
    await removeCoupon()
    setError(null)
    setIsRemoving(false)
  }

  return (
    <Card className="bg-foreground text-background flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{t('orderSummary')}</p>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">{t('subtotal')}</span>
          <span className="font-medium tabular-nums">{formatMoney(subtotal, currency, locale)}</span>
        </div>
        {Number(discount) > 0 && (
          <div className="flex justify-between text-green-400">
            <span className="flex items-center gap-1">
              <Tag className="size-3" />
              {coupon?.code ?? t('discount')}
            </span>
            <span className="font-medium tabular-nums">
              -{formatMoney(discount, currency, locale)}
            </span>
          </div>
        )}
        {Number(vat) > 0 && (
          <div className="flex justify-between">
            <span className="opacity-70">{vatLabel ?? t('vat')}</span>
            <span className="font-medium tabular-nums">{formatMoney(vat, currency, locale)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="opacity-70">{t('shipping')}</span>
          <span className="font-medium tabular-nums">
            {Number(shipping) === 0 ? t('free') : formatMoney(shipping, currency, locale)}
          </span>
        </div>
      </div>

      {showCouponInput &&
        (coupon ? (
          <div className="flex items-center justify-between rounded-lg bg-green-500/15 px-3 py-2 text-sm">
            <span className="flex items-center gap-1.5 text-green-400 font-medium">
              <Tag className="size-3.5" />
              {coupon.code}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label={t('removeCoupon')}
              className="text-background/50 hover:text-background disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Input
                aria-label={t('promoPlaceholder')}
                placeholder={t('promoPlaceholder')}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void handleApply()
                  }
                }}
                className="border-background/25 bg-background/10 text-background placeholder:text-background/50"
              />
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0"
                onClick={handleApply}
                disabled={isApplying || !code.trim()}
              >
                {isApplying ? '…' : t('apply')}
              </Button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        ))}

      <div className="flex justify-between border-t border-background/15 pt-4 text-base font-semibold">
        <span>{t('total')}</span>
        <span className="tabular-nums">{formatMoney(total, currency, locale)}</span>
      </div>

      <Button
        {...(ctaHref ? { render: <Link href={ctaHref} /> } : {})}
        onClick={onCta}
        disabled={disabled}
        size="lg"
        className="w-full bg-primary text-primary-foreground"
      >
        {ctaLabel}
      </Button>
    </Card>
  )
}
