'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomerLoginRequestSchema, type CustomerLoginRequest } from '@/types/dto/customer-auth.dto'
import { useCart } from '@/lib/cart/context'
import { sileo } from 'sileo'

export function LoginFormClient({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refresh: refreshCart, setAuthenticated } = useCart()
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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
        body: JSON.stringify({ ...values, remember_me: rememberMe }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toast.error(json.message ?? t('login.error'))
        return
      }
      setAuthenticated(true)
      await refreshCart()
      const redirect = searchParams.get('redirect')
      router.push(redirect ? `/${locale}/${redirect}` : `/${locale}`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="identifier" className="text-sm font-medium">{t('login.identifier')}</label>
        <Input id="identifier" {...form.register('identifier')} />
        {form.formState.errors.identifier && (
          <p className="text-sm text-destructive">{form.formState.errors.identifier.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">{t('login.password')}</label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} className="pe-10" {...form.register('password')} />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
          {t('login.rememberMe')}
        </label>
        <button
          type="button"
          onClick={() => toast.info(t('login.forgotPasswordComingSoon'))}
          className="text-primary underline-offset-2 hover:underline"
        >
          {t('login.forgotPassword')}
        </button>
      </div>

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? '...' : t('login.submit')}
      </Button>

      <div className="relative flex items-center py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="px-3 text-xs text-muted-foreground">{t('login.orContinueWith')}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => sileo.info({ title: t('login.googleComingSoon') })}
      >
        <svg viewBox="0 0 24 24" className="size-4" data-icon="inline-start">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.3 21.3 7.3 24 12 24z" />
          <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.9H1.4C.5 8.5 0 10.2 0 12s.5 3.5 1.4 5.1l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.9l4 3.1c.9-2.8 3.5-4.9 6.6-4.9z" />
        </svg>
        {t('login.google')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link href={`/${locale}/register`} className="font-medium text-primary underline-offset-2 hover:underline">
          {t('login.registerLink')}
        </Link>
      </p>
    </form>
  )
}
