'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Package, ShoppingCart, Ticket, LogOut, Store } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'dashboard' as const, path: (l: string) => `/${l}/admin`, icon: LayoutDashboard },
  { key: 'products' as const, path: (l: string) => `/${l}/admin/products`, icon: Package },
  { key: 'orders' as const, path: (l: string) => `/${l}/admin/orders`, icon: ShoppingCart },
  { key: 'coupons' as const, path: (l: string) => `/${l}/admin/coupons`, icon: Ticket },
]

export function AdminShellClient({ children, locale }: { children: React.ReactNode; locale: string }) {
  const t = useTranslations('admin')
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST', headers: { 'x-locale': locale } })
    router.push(`/${locale}/admin/login`)
    router.refresh()
  }

  return (
    <SidebarProvider>
      <Sidebar side={locale === 'ar' ? 'right' : 'left'} variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" onClick={() => router.push(`/${locale}`)}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">me.inc</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">Admin</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('nav.dashboard')}</SidebarGroupLabel>
            <SidebarMenu>
              {NAV_ITEMS.map(({ key, path, icon: Icon }) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    tooltip={t(`nav.${key}`)}
                    onClick={() => router.push(path(locale))}
                  >
                    <Icon />
                    <span>{t(`nav.${key}`)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive">
                <LogOut />
                <span>{t('nav.logout')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
        </header>
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  )
}
