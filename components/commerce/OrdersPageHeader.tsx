'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { LogOut } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/context'
import { toast } from 'sonner'

export function OrdersPageHeader() {
  const t = useTranslations('orders')
  const { setAuthenticated } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/customer/auth/logout', {
        method: 'POST',
        headers: {
          'x-locale': document.documentElement.lang || 'en',
        },
      })
      if (!res.ok) throw new Error('logout failed')
      await setAuthenticated(false)
      router.push('/login')
      router.refresh()
    } catch {
      toast.error(t('loadError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <h1 className="heading-2">{t('title')}</h1>
      <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
        <LogOut className="size-4" />
        {loading ? '…' : t('signOut')}
      </Button>
    </div>
  )
}
