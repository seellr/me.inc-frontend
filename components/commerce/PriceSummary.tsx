'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Tag, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/currency'

interface CouponValidation {
  code: string
  type: number
  value: number
}

export function PriceSummary({
  subtotal,
  shipping,
  ctaLabel,
  onCta,
  ctaHref,
  disabled,
  onCouponChange,
}: {
  subtotal: number
  shipping: number
  ctaLabel: string
  onCta?: () => void
  ctaHref?: string
  disabled?: boolean
  onCouponChange?: (coupon: { code: string; discount: number } | null) => void
}) {
  const locale = useLocale()
  const t = useTranslations('cart')

  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<{ code: string; discount: number; label: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const discount = applied?.discount ?? 0
  const total = subtotal + shipping - discount

  async function applyCode() {
    const upper = code.trim().toUpperCase()
    if (!upper) return
    setIsApplying(true)
    setError(null)
    try {
      const locale = typeof document !== 'undefined' ? document.documentElement.lang : 'en'
      const res = await fetch(`/api/public/coupons/${encodeURIComponent(upper)}/validate`, {
        headers: { 'x-locale': locale },
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.message ?? t('invalidPromo'))
        setApplied(null)
        onCouponChange?.(null)
        return
      }
      const coupon: CouponValidation = json.data
      let discountAmt = 0
      let label = ''
      if (coupon.type === 1) {
        discountAmt = Math.min(coupon.value, subtotal)
        label = `${formatCurrency(coupon.value, locale)} off`
      } else {
        discountAmt = Math.round(subtotal * (coupon.value / 100))
        label = `${coupon.value}% off`
      }
      const next = { code: upper, discount: discountAmt, label }
      setApplied(next)
      setCode('')
      onCouponChange?.({ code: upper, discount: discountAmt })
    } catch {
      setError(t('invalidPromo'))
    } finally {
      setIsApplying(false)
    }
  }

  function removeCode() {
    setApplied(null)
    setError(null)
    onCouponChange?.(null)
  }

  return (
    <Card variant="dark" className="bg-foreground text-background flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{t('orderSummary')}</p>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">{t('subtotal')}</span>
          <span className="font-medium tabular-nums">{formatCurrency(subtotal, locale)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span className="flex items-center gap-1"><Tag className="size-3" />{applied!.code}</span>
            <span className="font-medium tabular-nums">−{formatCurrency(discount, locale)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="opacity-70">{t('shipping')}</span>
          <span className="font-medium tabular-nums">
            {shipping === 0 ? t('free') : formatCurrency(shipping, locale)}
          </span>
        </div>
      </div>

      {applied ? (
        <div className="flex items-center justify-between rounded-lg bg-green-500/15 px-3 py-2 text-sm">
          <span className="flex items-center gap-1.5 text-green-400 font-medium">
            <Tag className="size-3.5" />{applied.code} ({applied.label})
          </span>
          <button type="button" onClick={removeCode} className="text-background/50 hover:text-background">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input
              placeholder={t('promoPlaceholder')}
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(null) }}
              onKeyDown={(e) => e.key === 'Enter' && applyCode()}
              className="border-background/25 bg-background/10 text-background placeholder:text-background/50"
            />
            <Button variant="secondary" size="sm" className="shrink-0" onClick={applyCode} disabled={isApplying}>
              {isApplying ? '...' : t('apply')}
            </Button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}

      <div className="flex justify-between border-t border-background/15 pt-4 text-base font-semibold">
        <span>{t('total')}</span>
        <span className="tabular-nums">{formatCurrency(total, locale)}</span>
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
