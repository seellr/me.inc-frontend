'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { makeCreateProductSchema, makeUpdateProductSchema } from '@/types/dto/product-form.dto'
import { ProductTypeValues, ProductTypeLabels } from '@/types/dto/product.dto'
import { useCreateProduct, useUpdateProduct } from '@/hooks/queries/useProducts'
import type { Product } from '@/types/dto/product.dto'

const DEFAULT_DELIVERY_METHOD = 1
const DEFAULT_VAT_RULE = 1

export function ProductFormClient({
  locale,
  existing,
  onSuccess,
}: {
  locale: string
  existing: Product | null
  onSuccess?: () => void
}) {
  const t = useTranslations('admin')
  const router = useRouter()
  const isNew = existing === null

  const schema = isNew ? makeCreateProductSchema(t) : makeUpdateProductSchema(t)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(existing?.ulid ?? '')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: existing
      ? {
        internal_name: existing.internal_name,
        type: existing.type.id,
        delivery_method: existing.delivery_method.id,
        base_price: Number(existing.base_price),
        sale_price: existing.sale_price ? Number(existing.sale_price) : undefined,
        currency: existing.currency,
        vat_rule: existing.vat_rule.id,
        sku: existing.sku,
        coupon_eligible: existing.coupon_eligible,
        featured: existing.featured,
        status: existing.status?.id,
        crm_score_on_purchase: 0,
        sort_order: 0,
        translations: { ar: { name: existing.name, one_liner: existing.one_liner ?? '' } },
      }
      : {
        internal_name: '',
        type: ProductTypeValues[0],
        delivery_method: DEFAULT_DELIVERY_METHOD,
        base_price: 0,
        currency: 'EGP',
        vat_rule: DEFAULT_VAT_RULE,
        sku: '',
        coupon_eligible: false,
        featured: false,
        crm_score_on_purchase: 0,
        sort_order: 0,
        translations: { ar: { name: '', one_liner: '' } },
      },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(values: any) {
    const mutation = isNew ? createProduct : updateProduct
    const result = await mutation.mutateAsync(values as never)
    if (!result.ok) {
      sileo.error({ title: t('products.form.saveError'), description: result.message })
      return
    }
    sileo.success({ title: t('products.form.saveSuccess') })
    if (onSuccess) {
      onSuccess()
    } else {
      router.push(`/${locale}/admin/products`)
      router.refresh()
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.internalName')}</label>
        <Input {...form.register('internal_name')} />
        {form.formState.errors.internal_name && (
          <p className="text-sm text-destructive">{String(form.formState.errors.internal_name.message)}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.nameAr')}</label>
        <Input {...form.register('translations.ar.name')} dir="rtl" />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(form.formState.errors.translations as any)?.ar?.name && (
          <p className="text-sm text-destructive">{String((form.formState.errors.translations as any).ar.name.message)}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.oneLinerAr')}</label>
        <Input {...form.register('translations.ar.one_liner')} dir="rtl" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.nameEn')}</label>
        <Input {...form.register('translations.en.name')} dir="ltr" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.oneLinerEn')}</label>
        <Input {...form.register('translations.en.one_liner')} dir="ltr" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.type')}</label>
        <Select
          value={String(form.watch('type'))}
          onValueChange={(v) => form.setValue('type', Number(v), { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ProductTypeValues.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {ProductTypeLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.sku')}</label>
        <Input {...form.register('sku')} />
        {form.formState.errors.sku && (
          <p className="text-sm text-destructive">{String(form.formState.errors.sku.message)}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('products.form.basePrice')}</label>
          <Input type="number" step="0.01" {...form.register('base_price', { valueAsNumber: true })} />
          {form.formState.errors.base_price && (
            <p className="text-sm text-destructive">{String(form.formState.errors.base_price.message)}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('products.form.salePrice')}</label>
          <Input type="number" step="0.01" {...form.register('sale_price', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(v) ? undefined : Number(v) })} />
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <label className="text-sm font-medium">{t('products.form.currency')}</label>
          <Input {...form.register('currency')} disabled maxLength={3} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{t('products.form.downloadLimit')}</label>
          <Input type="number" min={1} {...form.register('download_limit', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(v) ? undefined : Number(v) })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{t('products.form.accessExpiryDays')}</label>
          <Input type="number" min={1} {...form.register('access_expiry_days', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(v) ? undefined : Number(v) })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{t('products.form.crmScore')}</label>
          <Input type="number" min={0} {...form.register('crm_score_on_purchase', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(v) ? 0 : Number(v) })} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('products.form.sortOrder')}</label>
          <Input type="number" min={0} {...form.register('sort_order', { valueAsNumber: true, setValueAs: (v) => v === '' || isNaN(v) ? 0 : Number(v) })} />
        </div>
        {!isNew && (
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium">{t('products.form.status')}</label>
            <Select
              value={String(form.watch('status') ?? '')}
              onValueChange={(v) => form.setValue('status', Number(v))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[['1', 'Draft'], ['2', 'Published'], ['3', 'Archived'], ['4', 'Coming Soon'], ['5', 'Waitlist']].map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-6 items-center">
        <div className="flex items-center gap-2">
          <Switch
            checked={form.watch('coupon_eligible')}
            onCheckedChange={(v) => form.setValue('coupon_eligible', v)}
          />
          <label className="text-sm font-medium">{t('products.form.couponEligible')}</label>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={form.watch('featured')} onCheckedChange={(v) => form.setValue('featured', v)} />
          <label className="text-sm font-medium">{t('products.form.featured')}</label>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg" disabled={isPending} className="self-start">
          {isPending ? '...' : t('products.form.save')}
        </Button>
      </div>
    </form>
  )
}
