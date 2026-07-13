'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { StoreProduct } from '@/types/commerce'

export function ProductCard({ product }: { product: StoreProduct }) {
  const locale = useLocale()
  const t = useTranslations('products')
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  return (
    <Card variant="interactive" className="group flex flex-col gap-3 p-3">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="badge-sale absolute top-2 start-2">{t('featured')}</span>
        )}
        <span className="absolute top-2 end-2 flex items-center gap-0.5 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground shadow-ambient">
          <Star className="size-3 fill-amber text-amber" />
          {product.rating}
        </span>
      </Link>

      <Link href={`/products/${product.slug}`} className="flex flex-col gap-1 no-underline">
        <span className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</span>
        <span className="caption line-clamp-1">{product.category}</span>
      </Link>

      <div className="flex items-center justify-between gap-2">
        <span className="price">{formatCurrency(product.price, locale)}</span>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-full border border-border">
            <button
              type="button"
              aria-label={t('quantity')}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-6 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-4 text-center text-xs tabular-nums">{quantity}</span>
            <button
              type="button"
              aria-label={t('quantity')}
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-6 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <button
            type="button"
            aria-label={t('addToCart')}
            onClick={() => addItem(product.id, quantity)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
          >
            <ShoppingCart className="size-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}
