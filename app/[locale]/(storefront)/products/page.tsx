import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { ProductsListing } from '@/components/commerce/ProductsListing'
import { getStoreProducts, STORE_CATEGORIES } from '@/lib/store-data'

export const revalidate = 3600

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [products, t] = await Promise.all([getStoreProducts(3600), getTranslations('products')])

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <h1 className="heading-2 mb-8">{t('title')}</h1>
        <ProductsListing products={products} categories={STORE_CATEGORIES} />
      </Container>
    </Section>
  )
}
