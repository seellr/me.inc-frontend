import { redirect } from 'next/navigation'
import { getAdminTokenCookie } from '@/lib/admin/auth'
import { AdminQueryProvider } from '@/lib/admin/query-provider'
import { AdminShellClient } from '@/components/admin/AdminShellClient'

export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const token = await getAdminTokenCookie()

  // /admin/login lives outside this (dashboard) route group (real sibling
  // folder, not nested here), so this redirect can never loop back to
  // itself.
  if (!token) {
    redirect(`/${locale}/admin/login`)
  }

  return (
    <AdminQueryProvider>
      <AdminShellClient locale={locale}>{children}</AdminShellClient>
    </AdminQueryProvider>
  )
}
