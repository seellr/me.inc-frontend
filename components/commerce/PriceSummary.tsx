'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Tag, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/currency'

const VALID_CODES: Record<string, number> = {
  SAVE10: 0.10,
  SAVE20: 0.20,
  WELCOME: 0.15,
}

export function PriceSummary({
  subtotal,
  shipping,
  ctaLabel,
  onCta,
  ctaHref,
  disabled,
}: {
  subtotal: number
  shipping: number
  ctaLabel: string
  onCta?: () => void
  ctaHref?: string
  disabled?: boolean
}) {
  const locale = useLocale()
  const t = useTranslations('cart')

  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<{ code: string; rate: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const discount = applied ? Math.round(subtotal * applied.rate) : 0
  const total = subtotal + shipping - discount

  function applyCode() {
    const upper = code.trim().toUpperCase()
    if (!upper) return
    const rate = VALID_CODES[upper]
    if (rate) {
      setApplied({ code: upper, rate })
      setError(null)
      setCode('')
    } else {
      setError(t('invalidPromo'))
      setApplied(null)
    }
  }

  function removeCode() {
    setApplied(null)
    setError(null)
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
            <Tag className="size-3.5" />{applied.code} ({Math.round(applied.rate * 100)}% off)
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
            <Button variant="secondary" size="sm" className="shrink-0" onClick={applyCode}>
              {t('apply')}
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
