'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { AlertTriangle, Minus, Plus, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { formatMoney } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { CartItem, CartCoupon } from '@/types/commerce'

function isAbsoluteUrl(value: string | null): value is string {
  return !!value && /^https?:\/\//i.test(value)
}

export function CartLineItem({
  item,
  coupon,
  unavailable,
  onRemoveUnavailable,
}: {
  item: CartItem
  coupon?: CartCoupon | null
  unavailable?: boolean
  onRemoveUnavailable?: (productId: string) => void
}) {
  const locale = useLocale()
  const t = useTranslations('cart')
  const { updateQuantity, removeItem, currency } = useCart()
  const href = item.slug ? `/products/${item.slug}` : '/products'

  const isCouponApplied = !!coupon
  const isEligible = item.couponEligible !== false
  const moneyCurrency = item.currency ?? currency

  return (
    <div
      className={`flex items-center gap-4 border-b border-border py-4 last:border-0 ${
        unavailable ? 'opacity-50' : ''
      }`}
    >
      <Link
        href={href}
        aria-label={item.name}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {isAbsoluteUrl(item.image) && (
          <Image src={item.image} alt={item.name} fill className="object-contain p-3" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={href} className="line-clamp-1 text-sm font-semibold text-foreground no-underline">
          {item.name}
        </Link>
        {item.variant && <span className="caption">{item.variant}</span>}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {formatMoney(item.price, moneyCurrency, locale)}
          </span>
          {isCouponApplied && !isEligible && (
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {t('notEligibleForDiscount')}
            </span>
          )}
        </div>
        {item.lineTotal !== undefined && (
          <span className="text-xs text-green-600 font-medium">
            {t('lineTotal')}: {formatMoney(item.lineTotal, moneyCurrency, locale)}
          </span>
        )}
      </div>

      {unavailable ? (
        <div className="flex flex-col items-end gap-2">
          <span className="flex items-center gap-1 text-xs text-destructive font-medium">
            <AlertTriangle className="size-3" />
            {t('itemUnavailable')}
          </span>
          <button
            type="button"
            onClick={() => onRemoveUnavailable?.(item.productId)}
            className="text-xs text-destructive hover:underline"
          >
            {t('removeUnavailable')}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-full border border-border p-1">
          <button
            type="button"
            aria-label={t('decrease')}
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="flex size-7 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label={t('increase')}
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            disabled={item.quantity >= 10}
            className="flex size-7 items-center justify-center rounded-full text-foreground/70 hover:bg-muted disabled:opacity-40"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label={t('remove')}
        onClick={() => removeItem(item.productId)}
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
