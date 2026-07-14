import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { adminFetchServer } from '@/lib/admin/api-server'
import { getQueryClient } from '@/lib/admin/query-client'
import { couponsQueryKey } from '@/hooks/queries/useCoupons'
import { CouponsTableClient } from '@/components/admin/coupons/CouponsTableClient'
import type { Coupon } from '@/types/dto/coupon.dto'

export default async function AdminCouponsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('admin.coupons')
  const queryClient = getQueryClient()

  const result = await adminFetchServer<Coupon[]>('/admin/coupons')

  await queryClient.prefetchQuery({
    queryKey: couponsQueryKey(),
    queryFn: async () => ({
      items: result.ok ? result.data : [],
      meta: result.ok ? result.meta : undefined,
    }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <Link href={`/${locale}/admin/coupons/new`} className={buttonVariants()}>
          {t('new')}
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CouponsTableClient locale={locale} />
      </HydrationBoundary>
    </div>
  )
}
