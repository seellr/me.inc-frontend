import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LoginFormClient } from '@/components/admin/LoginFormClient'

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('admin')

  return (
    <div className="flex min-h-svh">
      <div className="flex w-full flex-col justify-between p-8 lg:w-[48%] lg:p-16">
        <Link href={`/${locale}`} className="text-lg font-semibold">
          me.inc
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div className="flex w-full max-w-sm flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">{t('login.title')}</h1>
          </div>
          <LoginFormClient locale={locale} />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t('login.termsPrefix')}{' '}
          <Link href={`/${locale}/terms`} className="underline underline-offset-2">
            {t('login.terms')}
          </Link>{' '}
          {t('login.and')}{' '}
          <Link href={`/${locale}/privacy`} className="underline underline-offset-2">
            {t('login.privacy')}
          </Link>
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:flex lg:w-[52%] lg:items-end lg:p-16">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 15% 15%, color-mix(in oklch, var(--primary), white 8%) 0%, transparent 55%), ' +
              'radial-gradient(110% 90% at 85% 85%, color-mix(in oklch, var(--secondary), black 30%) 0%, transparent 55%), ' +
              'var(--primary)',
          }}
        />
        <p className="relative max-w-lg text-3xl font-semibold leading-tight text-primary-foreground">
          {t('login.heroText')}
        </p>
      </div>
    </div>
  )
}
