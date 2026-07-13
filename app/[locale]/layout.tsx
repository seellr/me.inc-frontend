import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Toaster } from 'sileo'
import { DirectionProvider } from '@base-ui/react/direction-provider'
import '../globals.css'
import { cn } from '@/lib/utils'
import { chillax, thmanyah } from '@/lib/fonts'
import { routing } from '@/i18n/routing'

const DIRECTION: Record<string, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' }

export const metadata: Metadata = {
  title: 'me.inc',
  description: 'me.inc',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={DIRECTION[locale]}
      className={cn('h-full', 'antialiased', 'font-sans', chillax.variable, thmanyah.variable)}
    >
      <body className="min-h-full flex flex-col">
        <DirectionProvider direction={DIRECTION[locale]}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </DirectionProvider>
      </body>
      <Toaster position="top-right" />
    </html>
  )
}
