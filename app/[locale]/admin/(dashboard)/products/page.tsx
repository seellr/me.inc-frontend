import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { adminFetchServer } from '@/lib/admin/api-server'
import { getQueryClient } from '@/lib/admin/query-client'
import { productsQueryKey } from '@/hooks/queries/useProducts'
import { ProductsTableClient } from '@/components/admin/products/ProductsTableClient'
import type { Product } from '@/types/dto/product.dto'

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('admin.products')
  const queryClient = getQueryClient()

  const result = await adminFetchServer<Product[]>('/admin/products')

  await queryClient.prefetchQuery({
    queryKey: productsQueryKey(),
    queryFn: async () => ({
      items: result.ok ? result.data : [],
      meta: result.ok ? result.meta : undefined,
    }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <Link href={`/${locale}/admin/products/new`} className={buttonVariants()}>
          {t('new')}
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsTableClient locale={locale} />
      </HydrationBoundary>
    </div>
  )
}
