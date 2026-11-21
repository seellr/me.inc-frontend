'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import {
  Minus, Plus, Check, ShoppingBag, Heart, Share2, MessageCircle,
  Star, ChevronRight, Truck, RotateCcw, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCarousel } from '@/components/commerce/ProductCarousel'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { StoreProduct } from '@/types/commerce'
import { sileo } from 'sileo'
import { cn } from '@/lib/utils'

function ProductImagePlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5">
      <span className="font-display text-7xl font-bold text-primary/20 select-none">{initials}</span>
    </div>
  )
}

function RatingBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-muted-foreground text-xs">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-xs text-muted-foreground text-end">{Math.round(pct)}%</span>
    </div>
  )
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'size-4',
            i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          )}
        />
      ))}
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count.toLocaleString()})</span>
    </div>
  )
}

const MOCK_REVIEWS = [
  { id: 1, name: 'Sarah M.', rating: 5, date: '2 days ago', body: 'Absolutely love this product! Exceeded my expectations in every way.' },
  { id: 2, name: 'Ahmed K.', rating: 4, date: '1 week ago', body: 'Great quality, fast delivery. Would definitely recommend to others.' },
  { id: 3, name: 'Layla R.', rating: 5, date: '2 weeks ago', body: 'Exactly as described, very happy with my purchase!' },
]

const RATING_BARS: [string, number][] = [
  ['5', 72], ['4', 15], ['3', 7], ['2', 4], ['1', 2],
]

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

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  // Build thumbnail list — real image first, then placeholders
  const thumbs = product.image
    ? [product.image, product.image, product.image, product.image, product.image]
    : []

  const hasVariants = (product.variants?.length ?? 0) > 0

  // Color/size split — if variants are "Red / XL" style, split them
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const handleAddToCart = async () => {
    const { error } = await addItem(product.id, quantity)
    if (error === 'product_not_purchasable') {
      sileo.error({ title: t('itemUnavailable') })
      return
    }
    if (error) {
      sileo.error({ title: error })
      return
    }
    setAdded(true)
    sileo.success({ title: 'Added successfully', fill: 'black', styles: { title: 'text-white!' } })
    setTimeout(() => setAdded(false), 1800)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {})
      sileo.success({ title: 'Link copied' })
    }
  }

  const descShort = product.description?.slice(0, 180)
  const descLong = product.description
  const needsTruncate = (descLong?.length ?? 0) > 180

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      {/* Hero */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Image gallery */}
        <div className="flex gap-3">
          {/* Thumbnails column */}
          {thumbs.length > 0 && (
            <div className="flex flex-col gap-2 w-16 shrink-0">
              {thumbs.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={cn(
                    'aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors',
                    activeThumb === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="relative flex-1 aspect-square overflow-hidden rounded-2xl bg-muted shadow-ambient">
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
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {/* Category + breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Home</span>
            <ChevronRight className="size-3" />
            <span>{product.category}</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>

          <div>
            <h1 className="heading-2 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <StarRating rating={product.rating ?? 4.8} count={product.reviews ?? 128} />
              <span className="text-sm text-muted-foreground">• <strong className="text-foreground">2.4k+</strong> sold</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="price text-2xl font-bold">{formatCurrency(product.price, locale)}</span>
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.price * 1.2, locale)}
            </span>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">20% OFF</Badge>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {descExpanded || !needsTruncate ? descLong : `${descShort}…`}
              </p>
              {needsTruncate && (
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-1 text-xs font-medium text-primary hover:underline"
                >
                  {descExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          {/* Size selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Size</span>
              <button type="button" className="text-xs text-primary hover:underline">Size guide</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'min-w-10 h-10 rounded-lg border-2 px-3 text-sm font-medium transition-colors',
                    selectedSize === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t('quantity')}</span>
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
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="flex size-8 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <Button size="lg" onClick={handleAddToCart} className="flex-1">
              {added ? (
                <><Check className="size-4" /> {t('addedToCart')}</>
              ) : (
                <><ShoppingBag className="size-4" /> {t('addToCart')}</>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setWishlisted((v) => !v)}
              className={cn('w-12 px-0', wishlisted && 'border-rose-300 text-rose-500')}
            >
              <Heart className={cn('size-5', wishlisted && 'fill-rose-500')} />
            </Button>
            <Button size="lg" variant="outline" className="w-12 px-0" onClick={handleShare}>
              <Share2 className="size-5" />
            </Button>
            <Button size="lg" variant="outline" className="w-12 px-0">
              <MessageCircle className="size-5" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
            {[
              { icon: Truck, label: 'Free delivery', sub: 'On orders over 500 EGP' },
              { icon: RotateCcw, label: 'Easy returns', sub: '30-day policy' },
              { icon: ShieldCheck, label: 'Secure checkout', sub: '256-bit SSL' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className="size-5 text-primary" />
                <span className="text-xs font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="heading-3">Customer Reviews</h2>
          <Button variant="outline" size="sm">Write a review</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Rating summary */}
          <div className="flex flex-col gap-4 rounded-2xl border p-5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl font-bold tabular-nums">{(product.rating ?? 4.8).toFixed(1)}</span>
              <StarRating rating={product.rating ?? 4.8} count={product.reviews ?? 128} />
              <span className="text-sm text-muted-foreground mt-1">Based on {product.reviews ?? 128} reviews</span>
            </div>
            <div className="flex flex-col gap-2">
              {RATING_BARS.map(([label, pct]) => (
                <RatingBar key={label} label={label} pct={pct} />
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="flex flex-col gap-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="flex flex-col gap-2 rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {review.name.split(' ').map((w) => w[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={cn('size-3.5', i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
              </div>
            ))}
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
