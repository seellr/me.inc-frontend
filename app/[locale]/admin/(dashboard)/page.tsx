import { getTranslations } from 'next-intl/server'

export default async function AdminDashboardPage() {
  const t = await getTranslations('admin')
  return <h1 className="text-xl font-semibold">{t('nav.dashboard')}</h1>
}
