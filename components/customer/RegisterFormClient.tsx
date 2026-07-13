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
import { CustomerRegisterRequestSchema, type CustomerRegisterRequest } from '@/types/dto/customer-auth.dto'

export function RegisterFormClient({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<CustomerRegisterRequest>({
    resolver: zodResolver(CustomerRegisterRequestSchema),
    defaultValues: { first_name: '', last_name: '', email: '', password: '', password_confirmation: '' },
  })

  async function onSubmit(values: CustomerRegisterRequest) {
    setIsPending(true)
    try {
      const res = await fetch('/api/customer/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        sileo.error({ title: t('register.error'), description: json.message })
        return
      }
      sileo.success({ title: t('register.success') })
      router.push(`/${locale}/login`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('register.firstName')}</label>
          <Input {...form.register('first_name')} />
          {form.formState.errors.first_name && (
            <p className="text-sm text-destructive">{form.formState.errors.first_name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('register.lastName')}</label>
          <Input {...form.register('last_name')} />
          {form.formState.errors.last_name && (
            <p className="text-sm text-destructive">{form.formState.errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('register.email')}</label>
        <Input type="email" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('register.password')}</label>
        <Input type="password" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('register.passwordConfirmation')}</label>
        <Input type="password" {...form.register('password_confirmation')} />
        {form.formState.errors.password_confirmation && (
          <p className="text-sm text-destructive">{form.formState.errors.password_confirmation.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? '...' : t('register.submit')}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t('register.haveAccount')}{' '}
        <Link href={`/${locale}/login`} className="underline underline-offset-2">
          {t('register.loginLink')}
        </Link>
      </p>
    </form>
  )
}
