import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { getQueryClient } from '@/lib/admin/query-client'
import { adminFetchServer } from '@/lib/admin/api-server'
import { productQueryKey } from '@/hooks/queries/useProducts'
import { ProductFormClient } from '@/components/admin/products/ProductFormClient'
import type { Product } from '@/types/dto/product.dto'

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ locale: string; ulid: string }>
}) {
  const { locale, ulid } = await params
  const t = await getTranslations('admin.products')
  const isNew = ulid === 'new'
  const queryClient = getQueryClient()

  let existing: Product | null = null

  if (!isNew) {
    const result = await adminFetchServer<Product>(`/admin/products/${ulid}`)
    if (result.ok) {
      existing = result.data
      await queryClient.prefetchQuery({ queryKey: productQueryKey(ulid), queryFn: async () => result.data })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{isNew ? t('new') : existing?.name}</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductFormClient locale={locale} existing={existing} />
      </HydrationBoundary>
    </div>
  )
}
