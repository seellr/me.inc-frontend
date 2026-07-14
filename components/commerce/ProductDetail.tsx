'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, Check, ShoppingBag, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCarousel } from '@/components/commerce/ProductCarousel'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { StoreProduct } from '@/types/commerce'

function ProductImagePlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5">
      <span className="font-display text-7xl font-bold text-primary/20 select-none">{initials}</span>
    </div>
  )
}

export function ProductDetail({
  product,
  related,
}: {
  product: StoreProduct
  related: StoreProduct[]
}) {
  const locale = useLocale()
  const t = useTranslations('products')
  const { addItem, isAuthenticated } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = `/${locale}/login`
      return
    }
    addItem(product.id, quantity, { name: product.name, price: product.price, image: product.image, slug: product.slug })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      {/* Hero */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-ambient">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <ProductImagePlaceholder name={product.name} />
          )}
          {product.featured && (
            <Badge variant="new" className="absolute top-4 start-4">{t('featured')}</Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="caption mb-1 font-medium text-primary">{product.category}</p>
            <h1 className="heading-2 leading-tight">{product.name}</h1>
            {product.description && (
              <p className="body mt-3 text-muted-foreground">{product.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="price text-2xl">{formatCurrency(product.price, locale)}</span>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">{t('quantity')}</span>
            <div className="flex w-fit items-center gap-1 rounded-full border border-border p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-8 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center tabular-nums font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-8 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={handleAddToCart} className="flex-1 sm:flex-none sm:min-w-48">
              {added ? (
                <><Check className="size-4" /> {t('addedToCart')}</>
              ) : isAuthenticated ? (
                <><ShoppingBag className="size-4" /> {t('addToCart')}</>
              ) : (
                t('loginToAdd')
              )}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Tag className="size-4 text-primary" />
              <span>{product.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="heading-3 mb-6">{t('relatedTitle')}</h2>
          <ProductCarousel products={related} />
        </div>
      )}
    </div>
  )
}
