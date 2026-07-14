'use client'

import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, ShoppingCart, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DesktopMenu } from '@/components/navbar/desktop-menu'
import { MobileMenu } from '@/components/navbar/mobile-menu'
import { UpperBanner } from '@/components/navbar/upperBanner'
import { useScrolled } from '@/components/navbar/use-scrolled'
import { LocaleSwitcher } from '@/components/navbar/locale-switcher'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/context'

export function Navbar() {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrolled = useScrolled()
  const { count } = useCart()

  return (
    <>
      <UpperBanner />
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-transparent bg-background/85 backdrop-blur transition-[border-color] duration-300',
          scrolled && 'border-border'
        )}
      >
        <div
          className={cn(
            'section-container flex w-full items-center justify-between gap-4 transition-[height] duration-300 ease-out',
            scrolled ? 'h-14' : 'h-20'
          )}
        >
          <div className='flex items-center gap-8'>
            <Link href="/" className="heading-4 shrink-0 text-primary no-underline">
              me.inc
            </Link>

            <DesktopMenu />
          </div>

          <div className="flex items-center gap-4">
            {/* <button
              type="button"
              aria-label={t('search')}
              className="hidden size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground sm:flex"
            >
              <Search className="size-4.5" />
            </button> */}
            <Link
              href="/cart"
              aria-label={t('cart')}
              className="relative flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingCart className="size-4.5" />
              {count > 0 && (
                <span className="absolute top-1 end-1 flex size-3.5 items-center justify-center rounded-full bg-amber text-[9px] font-semibold text-amber-foreground">
                  {count}
                </span>
              )}
            </Link>

            <LocaleSwitcher />

            <Button nativeButton={false} render={<Link href="/login" />} className="hidden sm:inline-flex">
              {t('account')}
            </Button>

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
      </header>
    </>
  )
}
