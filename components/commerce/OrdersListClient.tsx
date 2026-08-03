'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Package, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/currency'

interface OrderItem {
  ulid: string
  invoice_number: string | null
  status: { id: number; label: string }
  total: string | number
  currency: string
  payment_method: { id: number; label: string }
  created_at: string
}

const STATUS_VARIANT: Record<number, 'eyebrow' | 'new' | 'outline' | 'sale'> = {
  1: 'eyebrow',
  2: 'new',
  3: 'sale',
  4: 'outline',
  5: 'sale',
}

export function OrdersListClient() {
  const locale = useLocale()
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loc = document.documentElement.lang || 'en'
    fetch('/api/customer/orders', {
      headers: { 'x-locale': loc, Accept: 'application/json' },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOrders(json.data ?? [])
        else setError(json.message ?? 'Failed to load orders')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-sm text-muted-foreground">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <p className="font-semibold">No orders yet</p>
        <p className="text-sm text-muted-foreground">Your orders will appear here after you purchase.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <Link key={order.ulid} href={`/orders/${order.ulid}`} className="no-underline">
          <Card className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">{order.invoice_number ?? order.ulid.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString(locale)}</p>
            </div>
            <div className="flex items-center gap-3 ms-auto">
              <Badge variant={STATUS_VARIANT[order.status.id] ?? 'secondary'}>{order.status.label}</Badge>
              <span className="text-sm font-semibold tabular-nums">{formatCurrency(Number(order.total), locale)}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
