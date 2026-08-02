'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Method = 'email' | 'phone'
type Step = 'form' | 'email-pending' | 'otp'

const baseSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  password: z.string().min(8).max(128),
  password_confirmation: z.string().min(8).max(128),
  email: z.string().optional(),
  phone: z.string().optional(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})
type FormValues = z.infer<typeof baseSchema>

export function RegisterFormClient({ locale }: { locale: string }) {
  const t = useTranslations('auth')
  const router = useRouter()
  const [method, setMethod] = useState<Method>('email')
  const [step, setStep] = useState<Step>('form')
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpPending, setOtpPending] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: { first_name: '', last_name: '', email: '', phone: '', password: '', password_confirmation: '' },
  })

  async function onSubmit(values: FormValues) {
    if (method === 'email' && !values.email) {
      form.setError('email', { message: 'Email is required' })
      return
    }
    if (method === 'phone' && !values.phone) {
      form.setError('phone', { message: 'Phone is required' })
      return
    }

    setIsPending(true)
    try {
      const payload = {
        method,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        password_confirmation: values.password_confirmation,
        ...(method === 'email' ? { email: values.email } : { phone: values.phone }),
      }

      const res = await fetch('/api/customer/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.message ?? t('register.error'))
        return
      }

      if (method === 'email') {
        setStep('email-pending')
      } else {
        setPhone(values.phone ?? '')
        setStep('otp')
      }
    } finally {
      setIsPending(false)
    }
  }

  async function onVerifyOtp() {
    if (otp.length !== 6) return
    setOtpPending(true)
    try {
      const res = await fetch('/api/customer/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({ phone, code: otp }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toast.error(json.message ?? 'Invalid OTP')
        return
      }
      toast.success('Phone verified — logging you in')
      router.push(`/${locale}`)
      router.refresh()
    } finally {
      setOtpPending(false)
    }
  }

  // Email-pending step
  if (step === 'email-pending') {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a verification link to <strong>{form.getValues('email')}</strong>.
            Click it to verify your account and then log in.
          </p>
        </div>
        <Link
          href={`/${locale}/login`}
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Go to login
        </Link>
      </div>
    )
  }

  // OTP step
  if (step === 'otp') {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Phone className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Enter verification code</h2>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to <strong>{phone}</strong>
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Verification code</label>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            maxLength={6}
            className="text-center text-xl tracking-widest"
          />
        </div>
        <Button onClick={onVerifyOtp} disabled={otp.length !== 6 || otpPending} size="lg">
          {otpPending ? '…' : 'Verify & continue'}
        </Button>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setStep('form')}
        >
          Back
        </button>
      </div>
    )
  }

  // Main form step
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-5">
      {/* Method toggle */}
      <div className="flex rounded-lg border p-1 gap-1">
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            method === 'email' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setMethod('phone')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            method === 'phone' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Phone className="h-4 w-4" />
          Phone
        </button>
      </div>

      {/* Name row */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('register.firstName')}</label>
          <Input {...form.register('first_name')} />
          {form.formState.errors.first_name && (
            <p className="text-xs text-destructive">{form.formState.errors.first_name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium">{t('register.lastName')}</label>
          <Input {...form.register('last_name')} />
          {form.formState.errors.last_name && (
            <p className="text-xs text-destructive">{form.formState.errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* Email or Phone */}
      {method === 'email' ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{t('register.email')}</label>
          <Input type="email" {...form.register('email')} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Phone number</label>
          <Input type="tel" placeholder="+20 100 000 0000" {...form.register('phone')} />
          {form.formState.errors.phone && (
            <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>
      )}

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('register.password')}</label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} className="pe-10" {...form.register('password')} />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">{t('register.passwordConfirmation')}</label>
        <Input type={showPassword ? 'text' : 'password'} {...form.register('password_confirmation')} />
        {form.formState.errors.password_confirmation && (
          <p className="text-xs text-destructive">{form.formState.errors.password_confirmation.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? '…' : t('register.submit')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('register.haveAccount')}{' '}
        <Link href={`/${locale}/login`} className="font-medium text-primary underline-offset-2 hover:underline">
          {t('register.loginLink')}
        </Link>
      </p>
    </form>
  )
}
