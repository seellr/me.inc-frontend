import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { getQueryClient } from '@/lib/admin/query-client'
import { adminFetchServer } from '@/lib/admin/api-server'
import { productQueryKey } from '@/hooks/queries/useProducts'
import { funnelConfigQueryKey } from '@/hooks/queries/useFunnelConfig'
import { ProductFormClient } from '@/components/admin/products/ProductFormClient'
import { FunnelConfigFormClient } from '@/components/admin/products/FunnelConfigFormClient'
import type { Product } from '@/types/dto/product.dto'
import type { FunnelConfig } from '@/types/dto/funnel.dto'

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ locale: string; ulid: string }>
}) {
  const { locale, ulid } = await params
  const t = await getTranslations('admin.products')
  const tFunnel = await getTranslations('admin.funnel')
  const isNew = ulid === 'new'
  const queryClient = getQueryClient()

  let existing: Product | null = null
  let funnelConfig: FunnelConfig | null = null

  if (!isNew) {
    const result = await adminFetchServer<Product>(`/admin/products/${ulid}`)
    if (result.ok) {
      existing = result.data
      await queryClient.prefetchQuery({ queryKey: productQueryKey(ulid), queryFn: async () => result.data })
    }

    const funnelResult = await adminFetchServer<FunnelConfig>(`/admin/products/${ulid}/funnel-config`)
    if (funnelResult.ok) {
      funnelConfig = funnelResult.data
      await queryClient.prefetchQuery({
        queryKey: funnelConfigQueryKey(ulid),
        queryFn: async () => funnelResult.data,
      })
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-semibold">{isNew ? t('new') : existing?.name}</h1>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductFormClient locale={locale} existing={existing} />
        </HydrationBoundary>
      </div>

      {!isNew && (
        <div className="flex flex-col gap-6 border-t pt-8">
          <h2 className="text-lg font-semibold">{tFunnel('title')}</h2>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <FunnelConfigFormClient productUlid={ulid} existing={funnelConfig} />
          </HydrationBoundary>
        </div>
      )}
    </div>
  )
}
