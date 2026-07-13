'use client'

import { useTranslations } from 'next-intl'
import { ShoppingBag } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { CartLineItem } from '@/components/commerce/CartLineItem'
import { PriceSummary } from '@/components/commerce/PriceSummary'
import { JourneyProgress } from '@/components/commerce/JourneyProgress'
import { useCart } from '@/lib/cart/context'

const SHIPPING_ESTIMATE = 0

export default function CartPage() {
  const t = useTranslations('cart')
  const { items, subtotal } = useCart()

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <h1 className="heading-2 mb-2">{t('title')}</h1>
        <JourneyProgress current="cart" />

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <ShoppingBag className="size-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold text-foreground">{t('emptyTitle')}</p>
              <p className="caption mt-1">{t('emptyBody')}</p>
            </div>
            <Button render={<Link href="/products" />}>{t('continueShopping')}</Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <div>
              {items.map((item) => (
                <CartLineItem key={`${item.productId}-${item.variant ?? ''}`} item={item} />
              ))}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <PriceSummary
                subtotal={subtotal}
                shipping={SHIPPING_ESTIMATE}
                ctaLabel={t('checkout')}
                ctaHref="/checkout"
              />
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}
