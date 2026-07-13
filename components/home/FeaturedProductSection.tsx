import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/motion'
import { formatCurrency } from '@/lib/currency'
import type { StoreProduct } from '@/types/commerce'

export async function FeaturedProductSection({ product }: { product: StoreProduct }) {
  const locale = await getLocale()
  const t = await getTranslations('home')

  return (
    <Section surface="tint">
      <Container>
        <RevealOnScroll className="grid items-center gap-10 overflow-hidden rounded-3xl bg-card p-8 shadow-ambient ring-1 ring-border sm:p-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image src={product.image} alt={product.name} fill className="object-contain p-10" />
          </div>

          <div className="flex flex-col items-start gap-4">
            <p className="eyebrow">{t('featuredEyebrow')}</p>
            <h2 className="heading-2">{product.name}</h2>
            <p className="body-lg max-w-md">{product.description}</p>
            <p className="price text-2xl">{formatCurrency(product.price, locale)}</p>
            <Button size="lg" render={<Link href={`/products/${product.slug}`} />}>
              {t('featuredCta')}
            </Button>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  )
}
