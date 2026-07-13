import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { ProductDetail } from '@/components/commerce/ProductDetail'
import { FALLBACK_PRODUCTS, getStoreProduct } from '@/lib/store-data'

export const revalidate = 3600

export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = await getStoreProduct(slug, 3600)
  if (!product) notFound()

  const related = FALLBACK_PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug
  ).slice(0, 4)

  return (
    <Section as="div" spacing="none" className="section-y">
      <Container>
        <ProductDetail product={product} related={related} />
      </Container>
    </Section>
  )
}
