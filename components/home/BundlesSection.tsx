import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { ProductCarousel } from '@/components/commerce/ProductCarousel'
import { RevealOnScroll } from '@/components/motion'
import type { StoreProduct } from '@/types/commerce'

export function BundlesSection({ products }: { products: StoreProduct[] }) {
  const t = useTranslations('home')

  if (products.length === 0) return null

  return (
    <Section>
      <Container>
        <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">{t('bundlesEyebrow')}</p>
            <h2 className="heading-2">{t('bundlesHeading')}</h2>
          </div>
          <Button variant="outline" nativeButton={false} render={<Link href="/products" />}>
            {t('bundlesCta')}
          </Button>
        </RevealOnScroll>

        <ProductCarousel products={products} />
      </Container>
    </Section>
  )
}
