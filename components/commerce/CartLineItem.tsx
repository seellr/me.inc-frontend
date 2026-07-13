'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { CartItem } from '@/types/commerce'

export function CartLineItem({ item }: { item: CartItem }) {
  const locale = useLocale()
  const t = useTranslations('cart')
  const { updateQuantity, removeItem } = useCart()
  const href = item.slug ? `/products/${item.slug}` : '/products'

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-0">
      <Link href={href} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={item.image} alt={item.name} fill className="object-contain p-3" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={href} className="line-clamp-1 text-sm font-semibold text-foreground no-underline">
          {item.name}
        </Link>
        {item.variant && <span className="caption">{item.variant}</span>}
        <span className="text-sm font-medium text-foreground">{formatCurrency(item.price, locale)}</span>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-border p-1">
        <button
          type="button"
          aria-label={t('decrease')}
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="flex size-7 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
        <button
          type="button"
          aria-label={t('increase')}
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="flex size-7 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

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
