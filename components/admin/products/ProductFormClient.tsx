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
import { makeCreateProductSchema, makeUpdateProductSchema, type ProductFormValues } from '@/types/dto/product-form.dto'
import { ProductTypeValues, ProductTypeLabels } from '@/types/dto/product.dto'
import { useCreateProduct, useUpdateProduct } from '@/hooks/queries/useProducts'
import type { Product } from '@/types/dto/product.dto'

const DEFAULT_DELIVERY_METHOD = 1
const DEFAULT_VAT_RULE = 1

export function ProductFormClient({ locale, existing }: { locale: string; existing: Product | null }) {
  const t = useTranslations('admin')
  const router = useRouter()
  const isNew = existing === null

  const schema = isNew ? makeCreateProductSchema(t) : makeUpdateProductSchema(t)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(existing?.ulid ?? '')

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: existing
      ? {
          internal_name: existing.internal_name,
          type: existing.type.id,
          delivery_method: existing.delivery_method.id,
          base_price: Number(existing.base_price),
          currency: existing.currency,
          vat_rule: existing.vat_rule.id,
          sku: existing.sku,
          coupon_eligible: existing.coupon_eligible,
          featured: existing.featured,
          translations: { ar: { name: existing.name, one_liner: existing.one_liner } },
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
          translations: { ar: { name: '', one_liner: '' } },
        },
  })

  async function onSubmit(values: ProductFormValues) {
    const mutation = isNew ? createProduct : updateProduct
    const result = await mutation.mutateAsync(values as never)
    if (!result.ok) {
      sileo.error({ title: t('products.form.saveError'), description: result.message })
      return
    }
    sileo.success({ title: t('products.form.saveSuccess') })
    router.push(`/${locale}/admin/products`)
    router.refresh()
  }

  const isPending = createProduct.isPending || updateProduct.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.internalName')}</label>
        <Input {...form.register('internal_name')} />
        {form.formState.errors.internal_name && (
          <p className="text-sm text-destructive">{form.formState.errors.internal_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('products.form.nameAr')}</label>
        <Input {...form.register('translations.ar.name')} dir="rtl" />
        {form.formState.errors.translations?.ar?.name && (
          <p className="text-sm text-destructive">{form.formState.errors.translations.ar.name.message}</p>
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
          <p className="text-sm text-destructive">{form.formState.errors.sku.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('products.form.basePrice')}</label>
          <Input type="number" step="0.01" {...form.register('base_price', { valueAsNumber: true })} />
          {form.formState.errors.base_price && (
            <p className="text-sm text-destructive">{form.formState.errors.base_price.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <label className="text-sm font-medium">{t('products.form.currency')}</label>
          <Input {...form.register('currency')} maxLength={3} />
        </div>
      </div>

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

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? '...' : t('products.form.save')}
      </Button>
    </form>
  )
}
