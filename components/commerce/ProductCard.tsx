'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Plus, ShoppingBag } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import { useCart } from '@/lib/cart/context'
import type { StoreProduct } from '@/types/commerce'
import { Button } from '../ui/button'

function ProductImagePlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="flex h-full rounded-lg! w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5">
      <span className="font-display text-4xl font-bold text-primary/30 select-none">{initials}</span>
    </div>
  )
}

export function ProductCard({ product }: { product: StoreProduct }) {
  const locale = useLocale()
  const t = useTranslations('products')
  const { addItem, isAuthenticated } = useCart()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = `/${locale}/login`
      return
    }
    addItem(product.id, 1, { name: product.name, price: product.price, image: product.image, slug: product.slug })
  }

  return (
    <Card variant="interactive" className="group flex flex-col overflow-hidden rounded-3xl p-4! h-full">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ProductImagePlaceholder name={product.name} />
        )}
        {product.featured && (
          <span className="badge-sale absolute top-2 start-2">{t('featured')}</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Link href={`/products/${product.slug}`} className="flex flex-col gap-0.5 no-underline">
          <span className="caption text-primary/70">{product.category}</span>
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{product.name}</span>
          {product.description && (
            <span className="caption mt-0.5 line-clamp-1 text-muted-foreground">{product.description}</span>
          )}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="price text-base">{formatCurrency(product.price, locale)}</span>

          {isAuthenticated ? (
            <Button
              type="button"
              aria-label={t('addToCart')}
              onClick={handleAddToCart}
            >
              <Plus className="size-4" />
            </Button>
          ) : (
            <Link
              href={`/login`}
              aria-label={t('loginToAdd')}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground/40 transition-all hover:border-foreground hover:text-foreground"
            >
              <ShoppingBag className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
