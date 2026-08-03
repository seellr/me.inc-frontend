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
import { sileo } from 'sileo'

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
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product.id, 1, { name: product.name, price: product.price, image: product.image, slug: product.slug })
    sileo.success({
      title: "Added successfully",
      fill: "black",
      styles: {
        title: "text-white!",
        description: "text-white/75!",
      },
    });
  }

  return (
    <Card className="group flex flex-col overflow-hidden rounded-3xl p-0! gap-0! h-full">
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
        <span className="badge-sale absolute top-2 start-2">{product.category}</span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4">
        <Link href={`/products/${product.slug}`} className="flex justify-start items-center no-underline">
          <span className="line-clamp-2 text-sm font-medium  leading-snug text-foreground">{product.name}</span>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-bold text-lg">{formatCurrency(product.price, locale)}</span>

          <Button
            type="button"
            aria-label={t('addToCart')}
            onClick={handleAddToCart}
          >
            {t('addToCart')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
