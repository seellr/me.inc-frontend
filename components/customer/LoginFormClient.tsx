'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomerLoginRequestSchema, type CustomerLoginRequest } from '@/types/dto/customer-auth.dto'

export function LoginFormClient({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<CustomerLoginRequest>({
    resolver: zodResolver(CustomerLoginRequestSchema),
    defaultValues: { identifier: '', password: '' },
  })

  async function onSubmit(values: CustomerLoginRequest) {
    setIsPending(true)
    try {
      const res = await fetch('/api/customer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        sileo.error({ title: t('login.error') })
        return
      }
      router.push(`/${locale}`)
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="identifier" className="text-sm font-medium">{t('login.identifier')}</label>
        <Input id="identifier" {...form.register('identifier')} />
        {form.formState.errors.identifier && (
          <p className="text-sm text-destructive">{form.formState.errors.identifier.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">{t('login.password')}</label>
        <Input id="password" type="password" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : t('login.submit')}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link href={`/${locale}/register`} className="underline underline-offset-2">
          {t('login.registerLink')}
        </Link>
      </p>
    </form>
  )
}
