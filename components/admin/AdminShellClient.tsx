'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Package, ShoppingCart, Ticket, User, LogOut } from 'lucide-react'

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
      <Sidebar side={locale === 'ar' ? 'right' : 'left'}>
        <SidebarHeader className="px-4 py-3 font-semibold">{t('nav.dashboard')}</SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin`)}>
                <LayoutDashboard data-icon="inline-start" />
                {t('nav.dashboard')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin/products`)}>
                <Package data-icon="inline-start" />
                {t('nav.products')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin/orders`)}>
                <ShoppingCart data-icon="inline-start" />
                {t('nav.orders')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin/coupons`)}>
                <Ticket data-icon="inline-start" />
                {t('nav.coupons')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${locale}/admin/profile`)}>
                <User data-icon="inline-start" />
                {t('nav.profile')}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut data-icon="inline-start" />
                {t('nav.logout')}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
        </div>
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
