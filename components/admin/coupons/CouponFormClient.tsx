'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateCouponSchema, type CreateCouponInput, CouponTypeValues, CouponTypeLabels } from '@/types/dto/coupon.dto'
import { useCreateCoupon, useUpdateCoupon } from '@/hooks/queries/useCoupons'
import type { Coupon } from '@/types/dto/coupon.dto'

export function CouponFormClient({ locale, existing }: { locale: string; existing: Coupon | null }) {
  const t = useTranslations('admin.coupons')
  const router = useRouter()
  const isNew = existing === null

  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon(existing?.ulid ?? '')

  const form = useForm<CreateCouponInput>({
    resolver: zodResolver(CreateCouponSchema),
    defaultValues: existing
      ? {
          code: existing.code,
          type: existing.type.id,
          value: Number(existing.value),
          max_uses: existing.max_uses,
          expires_at: existing.expires_at,
          active: existing.active,
        }
      : {
          code: '',
          type: CouponTypeValues[0],
          value: 0,
          max_uses: null,
          expires_at: null,
          active: true,
        },
  })

  async function onSubmit(values: CreateCouponInput) {
    const mutation = isNew ? createCoupon : updateCoupon
    const result = await mutation.mutateAsync(values)
    if (!result.ok) {
      sileo.error({ title: t('form.saveError'), description: result.message })
      return
    }
    sileo.success({ title: t('form.saveSuccess') })
    router.push(`/${locale}/admin/coupons`)
    router.refresh()
  }

  const isPending = createCoupon.isPending || updateCoupon.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('form.code')}</label>
        <Input {...form.register('code')} />
        {form.formState.errors.code && (
          <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('form.type')}</label>
        <Select
          value={String(form.watch('type'))}
          onValueChange={(v) => form.setValue('type', Number(v), { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CouponTypeValues.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {CouponTypeLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('form.value')}</label>
        <Input type="number" step="0.01" {...form.register('value', { valueAsNumber: true })} />
        {form.formState.errors.value && (
          <p className="text-sm text-destructive">{form.formState.errors.value.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('form.maxUses')}</label>
        <Input
          type="number"
          {...form.register('max_uses', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('form.expiresAt')}</label>
        <Input type="datetime-local" {...form.register('expires_at')} />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={form.watch('active')} onCheckedChange={(v) => form.setValue('active', v)} />
        <label className="text-sm font-medium">{t('form.active')}</label>
      </div>

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? '...' : t('form.save')}
      </Button>
    </form>
  )
}
