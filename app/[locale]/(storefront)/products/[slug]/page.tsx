import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { ProductDetail } from '@/components/commerce/ProductDetail'
import { storeFetchServer } from '@/lib/store/api-server'
import { productToStoreProduct } from '@/lib/store/adapters'
import type { Product } from '@/types/dto/product.dto'

export const revalidate = 3600

// generateStaticParams removed: slugs previously came from FALLBACK_PRODUCTS
// mock data. Real slugs live in the backend; this page now renders
// dynamically (ISR via `revalidate` still applies per-request).

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const result = await storeFetchServer<Product>(`/products/${slug}`, 3600)
  if (!result.ok) notFound()

  const product = productToStoreProduct(result.data)

  // No category filter on the public list endpoint — fetch the list and
  // filter by product type client-side (small dataset, acceptable here).
  const listResult = await storeFetchServer<Product[]>('/products', 3600)
  const related = (listResult.ok ? listResult.data : [])
    .map(productToStoreProduct)
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <ProductDetail product={product} related={related} />
      </Container>
    </Section>
  )
}
