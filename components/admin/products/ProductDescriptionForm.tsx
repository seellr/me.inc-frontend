'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProductDescription, useUpsertProductDescription } from '@/hooks/queries/useProducts'

export function ProductDescriptionForm({ ulid }: { ulid: string }) {
  const { data } = useProductDescription(ulid)
  const upsert = useUpsertProductDescription(ulid)

  const form = useForm<Record<string, unknown>>({ defaultValues: {} })

  useEffect(() => {
    if (data) form.reset(data as Record<string, unknown>)
  }, [data, form])

  async function onSubmit(values: Record<string, unknown>) {
    const result = await upsert.mutateAsync(values)
    if (!result.ok) {
      sileo.error({ title: 'Could not save description', description: result.message })
      return
    }
    sileo.success({ title: 'Description saved' })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Difficulty</label>
          <Input {...form.register('difficulty')} placeholder="e.g. Beginner" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Time to value</label>
          <Input {...form.register('time_to_value')} placeholder="e.g. 2 hours" />
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Arabic</p>
      {([
        ['translations.ar.one_liner', 'One-liner (AR)', 'max-300'],
        ['translations.ar.target_audience', 'Target audience (AR)'],
        ['translations.ar.pain_point', 'Pain point (AR)'],
        ['translations.ar.outcome', 'Outcome (AR)'],
        ['translations.ar.full_description', 'Full description (AR)'],
        ['translations.ar.what_you_get', 'What you get (AR)'],
        ['translations.ar.refund_policy', 'Refund policy (AR)'],
      ] as [string, string][]).map(([name, label]) => (
        <div key={name} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{label}</label>
          <textarea
            {...form.register(name)}
            dir="rtl"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          />
        </div>
      ))}

      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">English</p>
      {([
        ['translations.en.one_liner', 'One-liner (EN)'],
        ['translations.en.target_audience', 'Target audience (EN)'],
        ['translations.en.pain_point', 'Pain point (EN)'],
        ['translations.en.outcome', 'Outcome (EN)'],
        ['translations.en.full_description', 'Full description (EN)'],
        ['translations.en.what_you_get', 'What you get (EN)'],
        ['translations.en.refund_policy', 'Refund policy (EN)'],
      ] as [string, string][]).map(([name, label]) => (
        <div key={name} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{label}</label>
          <textarea
            {...form.register(name)}
            dir="ltr"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          />
        </div>
      ))}

      <Button type="submit" disabled={upsert.isPending} className="self-start">
        {upsert.isPending ? '...' : 'Save description'}
      </Button>
    </form>
  )
}
