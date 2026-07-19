'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from '@/components/ui/sidebar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard, Package, ShoppingCart, Ticket, LogOut, Store,
  BarChart3, Users, Tag, GitBranch, Mail, Zap, Bot, HelpCircle, Palette,
  ChevronsUpDown, Settings, User, Bell, Languages, ImageIcon,
} from 'lucide-react'
import { useAdminMe } from '@/hooks/queries/useAdminMe'

type NavItem = { key: string; path: (l: string) => string; icon: React.ElementType }

const NAV_GROUPS: Array<{ groupKey: string; items: NavItem[] }> = [
  {
    groupKey: 'store',
    items: [
      { key: 'dashboard', path: (l) => `/${l}/admin`, icon: LayoutDashboard },
      { key: 'products', path: (l) => `/${l}/admin/products`, icon: Package },
      { key: 'orders', path: (l) => `/${l}/admin/orders`, icon: ShoppingCart },
      { key: 'coupons', path: (l) => `/${l}/admin/coupons`, icon: Ticket },
    ],
  },
  {
    groupKey: 'growth',
    items: [
      { key: 'analytics', path: (l) => `/${l}/admin/analytics`, icon: BarChart3 },
      { key: 'crm', path: (l) => `/${l}/admin/crm`, icon: Users },
    ],
  },
  {
    groupKey: 'funnels',
    items: [
      { key: 'funnels', path: (l) => `/${l}/admin/funnels`, icon: GitBranch },
      { key: 'email', path: (l) => `/${l}/admin/email`, icon: Mail },
      { key: 'automation', path: (l) => `/${l}/admin/automation`, icon: Zap },
    ],
  },
  {
    groupKey: 'tools',
    items: [
      { key: 'ai-tools', path: (l) => `/${l}/admin/ai-tools`, icon: Bot },
      { key: 'quizzes', path: (l) => `/${l}/admin/quizzes`, icon: HelpCircle },
      { key: 'brand', path: (l) => `/${l}/admin/brand`, icon: Palette },
    ],
  },
  {
    groupKey: 'content',
    items: [
      { key: 'media', path: (l) => `/${l}/admin/media`, icon: ImageIcon },
      { key: 'localization', path: (l) => `/${l}/admin/localization`, icon: Languages },
    ],
  },
]

function AdminProfileDropdown({ locale, onLogout }: { locale: string; onLogout: () => void }) {
  const { data: admin } = useAdminMe()
  const router = useRouter()

  const initials = admin
    ? `${admin.first_name?.[0] ?? ''}${admin.last_name?.[0] ?? ''}`.toUpperCase() || 'A'
    : 'A'
  const displayName = admin
    ? [admin.first_name, admin.last_name].filter(Boolean).join(' ') || admin.email
    : '…'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-semibold">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">{admin?.email ?? ''}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">{admin?.email ?? ''}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(`/${locale}/admin/profile`)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${locale}/admin/settings`)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${locale}/admin/notifications`)}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
          {NAV_GROUPS.map((group) => (
            <SidebarGroup key={group.groupKey}>
              <SidebarGroupLabel>{t(`nav.group.${group.groupKey}`)}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map(({ key, path, icon: Icon }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      tooltip={t(`nav.${key}`, { defaultValue: key })}
                      onClick={() => router.push(path(locale))}
                    >
                      <Icon />
                      <span>{t(`nav.${key}`, { defaultValue: key })}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <AdminProfileDropdown locale={locale} onLogout={handleLogout} />
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
