'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Package, ChevronRight, RefreshCw } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatMoney } from '@/lib/currency'
import { listOrders } from '@/lib/orders/api'
import type { CustomerOrderView } from '@/types/commerce'

const STATUS_VARIANT: Record<number, 'eyebrow' | 'new' | 'outline' | 'sale'> = {
  1: 'eyebrow',
  2: 'new',
  3: 'sale',
  4: 'outline',
  5: 'eyebrow',
  6: 'new',
}

export function OrdersListClient() {
  const locale = useLocale()
  const t = useTranslations('orders')
  const [orders, setOrders] = useState<CustomerOrderView[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const load = useCallback(async (cursor?: string | null) => {
    const result = await listOrders(cursor)
    if (result.ok) {
      setOrders((current) => (cursor ? [...current, ...result.data] : result.data))
      setNextCursor((result.meta?.next_cursor as string | null | undefined) ?? null)
      setHasMore(Boolean(result.meta?.has_more))
      setError(null)
    } else {
      setError(result.message)
    }
    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label={t('title')}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold">{t('loadError')}</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => { setLoading(true); void load() }}>
          <RefreshCw className="size-4" />
          {t('retry')}
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <p className="font-semibold">{t('emptyTitle')}</p>
        <p className="text-sm text-muted-foreground">{t('emptyBody')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <Link key={order.ulid} href={`/orders/${order.ulid}`} className="no-underline">
          <Card className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">
                {order.invoiceNumber ?? `#${order.ulid.slice(0, 8).toUpperCase()}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.createdAt, locale)}
              </p>
            </div>
            <div className="flex items-center gap-3 ms-auto">
              <Badge variant={STATUS_VARIANT[order.statusId ?? 0] ?? 'secondary'}>
                {order.statusLabel ||
                  (order.statusId ? t(`status.${order.statusId}`) : '')}
              </Badge>
              <span className="text-sm font-semibold tabular-nums">
                {formatMoney(order.total, order.currency, locale)}
              </span>
              <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
            </div>
          </Card>
        </Link>
      ))}

      {hasMore && nextCursor && (
        <Button
          variant="outline"
          onClick={() => {
            setLoadingMore(true)
            void load(nextCursor)
          }}
          disabled={loadingMore}
          className="mx-auto mt-2"
        >
          {loadingMore ? '…' : t('loadMore')}
        </Button>
      )}
    </div>
  )
}
