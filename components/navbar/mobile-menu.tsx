'use client'

import { Link } from '@/i18n/navigation'
import { Dialog } from '@base-ui/react/dialog'
import { ChevronDown, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { getDirection } from '@/lib/i18n/direction'
import { navMenus } from './nav-data'
import { LinkRow } from './link-row'
import { PromoCard } from './promo-card'

export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('nav')
  const dir = getDirection(useLocale())
  const close = () => onOpenChange(false)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            'fixed inset-y-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-background p-gutter outline-none transition-transform duration-250 ease-out',
            dir === 'rtl'
              ? 'left-0 data-starting-style:-translate-x-full data-ending-style:-translate-x-full'
              : 'right-0 data-starting-style:translate-x-full data-ending-style:translate-x-full'
          )}
        >
          <div className="flex items-center justify-between pb-4">
            <span className="heading-4 text-primary">me.inc</span>
            <Dialog.Close
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-full text-foreground/70 hover:bg-muted"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-1">
            {navMenus.map((menu) => {
              if (menu.kind === 'link') {
                return (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    onClick={close}
                    className="border-b border-border py-3 text-sm font-medium text-foreground no-underline"
                  >
                    {menu.label}
                  </Link>
                )
              }

              return (
                <details key={menu.label} className="group border-b border-border py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-medium text-foreground">
                    {menu.label}
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="flex flex-col gap-4 py-2" onClick={close}>
                    {menu.kind === 'product' &&
                      menu.columns.map((column) => (
                        <div key={column.heading}>
                          <p className="eyebrow mb-1.5">{column.heading}</p>
                          <div className="flex flex-col">
                            {column.items.map((item) => (
                              <LinkRow key={item.href} {...item} />
                            ))}
                          </div>
                        </div>
                      ))}
                    {menu.kind === 'product' &&
                      menu.promos.map((promo) => <PromoCard key={promo.href} {...promo} />)}

                    {menu.kind === 'customers' && (
                      <div className="flex flex-col gap-3">
                        {menu.cards.map((card) => (
                          <Link key={card.href} href={card.href} className="no-underline">
                            <span className="block text-sm font-semibold text-foreground">{card.title}</span>
                            <span className="text-xs text-muted-foreground">Read full story ›</span>
                          </Link>
                        ))}
                        <Link href={menu.viewAllHref} className="text-sm font-medium text-foreground no-underline">
                          View all customer stories ›
                        </Link>
                      </div>
                    )}

                    {menu.kind === 'resources' && (
                      <>
                        {menu.promos.map((promo) => (
                          <PromoCard key={promo.href} {...promo} />
                        ))}
                        {menu.columns.map((column, i) => (
                          <div key={i} className="flex flex-col">
                            {column.items.map((item) => (
                              <LinkRow key={item.href} {...item} />
                            ))}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </details>
              )
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2 pt-6">
            <Link
              href="/login"
              onClick={close}
              className="flex h-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground no-underline"
            >
              {t('account')}
            </Link>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
