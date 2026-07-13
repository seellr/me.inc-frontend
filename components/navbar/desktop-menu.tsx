'use client'

import { Link } from '@/i18n/navigation'
import { NavigationMenu } from '@base-ui/react/navigation-menu'
import { ChevronDown } from 'lucide-react'
import { navMenus } from './nav-data'
import { LinkRow } from './link-row'
import { PromoCard } from './promo-card'

const triggerClass =
  'flex h-9 items-center gap-1 rounded-full px-4 py-1 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted data-popup-open:bg-muted data-popup-open:text-foreground'

const contentTransitionClass =
  'transition-[opacity,transform] duration-200 ease-out ' +
  'data-starting-style:opacity-0 data-ending-style:opacity-0 ' +
  'data-starting-style:data-[activation-direction=left]:-translate-x-4 ' +
  'data-starting-style:data-[activation-direction=right]:translate-x-4 ' +
  'data-ending-style:data-[activation-direction=left]:translate-x-4 ' +
  'data-ending-style:data-[activation-direction=right]:-translate-x-4'

export function DesktopMenu() {
  return (
    <NavigationMenu.Root className="hidden min-w-0 lg:block" delay={80} closeDelay={100}>
      <NavigationMenu.List className="flex items-center gap-2">
        {navMenus.map((menu) => {
          if (menu.kind === 'link') {
            return (
              <NavigationMenu.Item key={menu.label}>
                <NavigationMenu.Link render={<Link href={menu.href} />} className={triggerClass}>
                  {menu.label}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )
          }

          return (
            <NavigationMenu.Item key={menu.label}>
              <NavigationMenu.Trigger className={triggerClass}>
                {menu.label}
                <NavigationMenu.Icon className="transition-transform duration-200 ease-out data-popup-open:rotate-180">
                  <ChevronDown className="size-3.5" />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className={contentTransitionClass}>
                <div className="section-container py-8">
                  {menu.kind === 'product' && (
                    <div className="grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse">
                      {menu.columns.map((column) => (
                        <div key={column.heading} className="px-6 first:ps-0">
                          <p className="eyebrow mb-2">{column.heading}</p>
                          <div className="flex flex-col">
                            {column.items.map((item) => (
                              <LinkRow key={item.href} {...item} />
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col gap-3 px-6">
                        {menu.promos.map((promo) => (
                          <PromoCard key={promo.href} {...promo} />
                        ))}
                      </div>
                    </div>
                  )}

                  {menu.kind === 'customers' && (
                    <div>
                      <p className="eyebrow mb-4">{menu.heading}</p>
                      <div className="grid grid-cols-3 gap-6">
                        {menu.cards.map((card) => (
                          <Link
                            key={card.href}
                            href={card.href}
                            className="flex flex-col gap-3 no-underline"
                          >
                            <span className="text-sm font-bold text-foreground">{card.logo}</span>
                            <span className="aspect-video w-full rounded-lg bg-muted" aria-hidden />
                            <span className="text-sm leading-snug font-semibold text-foreground">
                              {card.title}
                            </span>
                            <span className="text-sm text-muted-foreground">Read full story ›</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 border-t border-border pt-4">
                        <Link href={menu.viewAllHref} className="text-sm font-medium text-foreground no-underline">
                          View all customer stories ›
                        </Link>
                      </div>
                    </div>
                  )}

                  {menu.kind === 'resources' && (
                    <div className="grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse">
                      <div className="flex flex-col gap-3 pe-6">
                        <p className="eyebrow mb-1">{menu.label}</p>
                        {menu.promos.map((promo) => (
                          <PromoCard key={promo.href} {...promo} />
                        ))}
                      </div>
                      {menu.columns.map((column, i) => (
                        <div key={i} className="flex flex-col px-6">
                          {column.items.map((item) => (
                            <LinkRow key={item.href} {...item} />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          )
        })}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          side="bottom"
          sideOffset={0}
          collisionPadding={0}
          className="fixed inset-x-0 top-[var(--positioner-height)] z-[9999] w-screen transition-[top] duration-200 ease-out data-instant:transition-none"
        >
          <NavigationMenu.Popup className="relative h-[var(--popup-height)] w-screen origin-top overflow-hidden border-t border-border bg-background text-foreground shadow-lg shadow-black/5 outline-none transition-[opacity,transform,height] duration-250 ease-out data-ending-style:opacity-0 data-ending-style:-translate-y-1 data-starting-style:opacity-0 data-starting-style:-translate-y-1">
            <NavigationMenu.Viewport className="relative h-full w-full" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}
