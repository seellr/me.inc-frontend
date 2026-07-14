import { getTranslations } from 'next-intl/server'
import { adminFetchServer } from '@/lib/admin/api-server'
import { CouponFormClient } from '@/components/admin/coupons/CouponFormClient'
import type { Coupon } from '@/types/dto/coupon.dto'

export default async function CouponEditPage({
  params,
}: {
  params: Promise<{ locale: string; ulid: string }>
}) {
  const { locale, ulid } = await params
  const t = await getTranslations('admin.coupons')
  const isNew = ulid === 'new'

  let existing: Coupon | null = null

  if (!isNew) {
    // No single-coupon GET endpoint exists on the backend — find it from
    // the admin coupon list instead.
    const result = await adminFetchServer<Coupon[]>('/admin/coupons')
    if (result.ok) {
      existing = result.data.find((c) => c.ulid === ulid) ?? null
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{isNew ? t('new') : existing?.code}</h1>
      <CouponFormClient locale={locale} existing={existing} />
    </div>
  )
}
