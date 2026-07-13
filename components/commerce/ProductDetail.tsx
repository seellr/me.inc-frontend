'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Minus, Plus, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/commerce/ProductCard'
import { ReviewsSection } from '@/components/commerce/ReviewsSection'
import { FaqSection } from '@/components/commerce/FaqSection'
import { StaggerGrid } from '@/components/motion'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { StoreProduct } from '@/types/commerce'

type Tab = 'description' | 'specs' | 'shipping'

export function ProductDetail({
  product,
  related,
}: {
  product: StoreProduct
  related: StoreProduct[]
}) {
  const locale = useLocale()
  const t = useTranslations('products')
  const { addItem } = useCart()

  const [variant, setVariant] = useState(product.variants?.[0])
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<Tab>('description')
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain p-16 transition-transform duration-500 hover:scale-105"
            />
            {product.featured && <Badge variant="new" className="absolute top-4 start-4">{t('featured')}</Badge>}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="caption">{product.category}</p>
            <h1 className="heading-2 mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5 text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4" fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <p className="price">{formatCurrency(product.price, locale)}</p>
          <p className="body">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">{t('title')}</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    className={
                      'rounded-full border px-3.5 py-1.5 text-sm transition-colors ' +
                      (variant === v
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-foreground hover:bg-muted')
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <span className="w-8 text-center tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-8 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Sticky on mobile so it stays reachable while scrolling the description */}
          <div className="sticky bottom-4 z-10 pt-2 sm:static sm:pt-0">
            <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto">
              {added ? (
                <>
                  <Check className="size-4" /> {t('addedToCart')}
                </>
              ) : (
                t('addToCart')
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-6 border-b border-border">
          {(['description', 'specs', 'shipping'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={
                '-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ' +
                (tab === key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')
              }
            >
              {t(`tabs.${key}`)}
            </button>
          ))}
        </div>
        <div className="body py-6">
          {tab === 'description' && product.description}
          {tab === 'specs' && `${product.category} · ${product.rating}★ (${product.reviews})`}
          {tab === 'shipping' && t('shippingInfo')}
        </div>
      </div>

      <ReviewsSection rating={product.rating} reviewCount={product.reviews} />

      <FaqSection />

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="heading-3 mb-6">{t('relatedTitle')}</h2>
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </StaggerGrid>
        </div>
      )}
    </div>
  )
}
