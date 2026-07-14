import { getTranslations } from 'next-intl/server'
import { adminFetchServer } from '@/lib/admin/api-server'
import type { Admin } from '@/types/dto/auth.dto'

export default async function AdminProfilePage() {
  const t = await getTranslations('admin.profile')
  const result = await adminFetchServer<Admin>('/admin/auth/me')

  if (!result.ok) {
    return <p className="text-destructive">{result.message}</p>
  }

  const admin = result.data

  const rows: [string, string][] = [
    [t('firstName'), admin.first_name],
    [t('lastName'), admin.last_name],
    [t('email'), admin.email],
    [t('role'), admin.is_super_admin ? t('superAdmin') : admin.roles.join(', ') || '—'],
    [t('status'), admin.status === 1 ? t('active') : String(admin.status)],
  ]

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <dl className="flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b pb-2">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
