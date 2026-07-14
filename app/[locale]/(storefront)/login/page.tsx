import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LoginFormClient } from '@/components/customer/LoginFormClient'

export default async function CustomerLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('auth')

  return (
    <div className="flex min-h-svh">
      <div className="flex w-full flex-col justify-between p-8 lg:w-[48%] lg:p-16">
        <Link href={`/${locale}`} className="text-lg font-semibold">
          me.inc
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-12">
          <div className="flex w-full max-w-sm flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold">{t('login.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
          </div>
          <LoginFormClient locale={locale} />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t('copyright')}
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:flex lg:w-[52%] lg:items-end lg:p-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative flex flex-col gap-4">
          <p className="max-w-lg text-3xl font-semibold leading-tight text-white">
            {t('login.heroText')}
          </p>
          <p className="max-w-md text-sm text-white/80">
            {t('login.heroSubtext')}
          </p>
        </div>
      </div>
    </div>
  )
}
