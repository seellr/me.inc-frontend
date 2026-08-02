import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { ProductsListing } from '@/components/commerce/ProductsListing'
import { STORE_CATEGORIES } from '@/lib/store-data'
import { storeFetchServer } from '@/lib/store/api-server'
import { productToStoreProduct } from '@/lib/store/adapters'
import type { Product } from '@/types/dto/product.dto'

export const revalidate = 300

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [result, t] = await Promise.all([storeFetchServer<Product[]>('/products', 0), getTranslations('products')])
  const products = (result.ok ? result.data : []).map(productToStoreProduct)

  return (
    <Section as="div" className="section-y">
      <Container>
        <h1 className="heading-2 mb-8">{t('title')}</h1>
        <ProductsListing products={products} categories={STORE_CATEGORIES} />
      </Container>
    </Section>
  )
}
