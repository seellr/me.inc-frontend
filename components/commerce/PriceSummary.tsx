'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/currency'

export function PriceSummary({
  subtotal,
  shipping,
  ctaLabel,
  onCta,
  ctaHref,
}: {
  subtotal: number
  shipping: number
  ctaLabel: string
  onCta?: () => void
  ctaHref?: string
}) {
  const locale = useLocale()
  const t = useTranslations('cart')
  const total = subtotal + shipping

  return (
    <Card variant="dark" className="bg-foreground text-background flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{t('orderSummary')}</p>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">{t('subtotal')}</span>
          <span className="font-medium tabular-nums">{formatCurrency(subtotal, locale)}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">{t('shipping')}</span>
          <span className="font-medium tabular-nums">
            {shipping === 0 ? t('free') : formatCurrency(shipping, locale)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder={t('promoPlaceholder')} className="border-background/25 bg-background/10 text-background placeholder:text-background/50" />
        <Button variant="secondary" size="sm" className="shrink-0">
          {t('apply')}
        </Button>
      </div>

      <div className="flex justify-between border-t border-background/15 pt-4 text-base font-semibold">
        <span>{t('total')}</span>
        <span className="tabular-nums">{formatCurrency(total, locale)}</span>
      </div>

      <Button
        {...(ctaHref ? { render: <Link href={ctaHref} /> } : {})}
        onClick={onCta}
        size="lg"
        className="w-full bg-primary text-primary-foreground"
      >
        {ctaLabel}
      </Button>
    </Card>
  )
}
