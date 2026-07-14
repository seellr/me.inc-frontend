import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/commerce/ProductCard'
import { RevealOnScroll, StaggerGrid } from '@/components/motion'
import type { StoreProduct } from '@/types/commerce'

export function LatestProductsSection({ products }: { products: StoreProduct[] }) {
  const t = useTranslations('home')

  return (
    <Section>
      <Container>
        <RevealOnScroll className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">{t('latestEyebrow')}</p>
            <h2 className="heading-2">{t('latestHeading')}</h2>
          </div>
          <Button variant="outline" nativeButton={false} render={<Link href="/products" />}>
            {t('latestCta')}
          </Button>
        </RevealOnScroll>

        <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGrid>
      </Container>
    </Section>
  )
}
