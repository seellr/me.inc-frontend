'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { SUPPORTED_LOCALES } from '@/lib/utils/constants'

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border p-0.5 text-xs font-medium">
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          aria-current={locale === code}
          className={
            'rounded-full px-2 py-1 uppercase transition-colors ' +
            (locale === code ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')
          }
        >
          {code}
        </button>
      ))}
    </div>
  )
}
