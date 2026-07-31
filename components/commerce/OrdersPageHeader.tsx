'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/context'
import { toast } from 'sonner'

export function OrdersPageHeader() {
  const { setAuthenticated } = useCart()
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? 'en'
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/customer/auth/logout', {
        method: 'POST',
        headers: { 'x-locale': locale },
      })
      setAuthenticated(false)
      router.push(`/${locale}/login`)
    } catch {
      toast.error('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="heading-2">My Orders</h1>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={loading}
      >
        <LogOut className="size-4" />
        {loading ? '...' : 'Sign out'}
      </Button>
    </div>
  )
}
