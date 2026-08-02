'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Package, MapPin, CreditCard, ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/currency'
import type { CustomerOrder } from '@/types/dto/customer-order.dto'

const STATUS_VARIANT: Record<number, 'eyebrow' | 'new' | 'outline' | 'sale'> = {
  1: 'eyebrow',
  2: 'new',
  3: 'sale',
  4: 'outline',
  5: 'sale',
}

export function OrderDetailClient({
  ulid,
  initialOrder,
}: {
  ulid: string
  initialOrder: CustomerOrder | null
}) {
  const locale = useLocale()
  const [order, setOrder] = useState<CustomerOrder | null>(initialOrder)
  const [loading, setLoading] = useState(!initialOrder)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialOrder) return
    const loc = document.documentElement.lang || 'en'
    fetch(`/api/customer/orders/${ulid}`, {
      headers: { 'x-locale': loc, Accept: 'application/json' },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOrder(json.data)
        else setError(json.message ?? 'Order not found')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [ulid, initialOrder])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <p className="font-semibold">{error ?? 'Order not found'}</p>
        <Button nativeButton={false} render={<Link href="/orders" />} variant="outline">
          <ArrowLeft className="size-4" /> Back to orders
        </Button>
      </div>
    )
  }

  const total = Number(order.total)
  const subtotal = order.subtotal !== undefined ? Number(order.subtotal) : total
  const discount = order.discount !== undefined ? Number(order.discount) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link href="/orders" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="size-4" /> All orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">
            {order.invoice_number ?? `#${order.ulid.slice(0, 8).toUpperCase()}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString(locale, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status.id] ?? 'outline'} className="text-sm px-3 py-1">
          {order.status.label}
        </Badge>
      </div>

      {/* Items */}
      <Card variant="static" className="flex flex-col gap-4 p-5">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Package className="size-3.5" /> Items ({order.items?.length ?? 0})
        </p>
        {(order.items ?? []).map((item) => (
          <div key={item.ulid} className="flex items-center justify-between gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.product_name}</span>
              <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">
              {formatCurrency(Number(item.total), locale)}
            </span>
          </div>
        ))}

        <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, locale)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount, locale)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-border mt-1">
            <span>Total</span>
            <span>{formatCurrency(total, locale)}</span>
          </div>
        </div>
      </Card>

      {/* Shipping address */}
      {order.shipping_address && (
        <Card variant="static" className="flex flex-col gap-3 p-5">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MapPin className="size-3.5" /> Shipping Address
          </p>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {order.shipping_address.full_name && (
              <p className="font-medium text-foreground">{order.shipping_address.full_name}</p>
            )}
            {order.shipping_address.line1 && <p>{order.shipping_address.line1}</p>}
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            {(order.shipping_address.city || order.shipping_address.country) && (
              <p>
                {[order.shipping_address.city, order.shipping_address.country, order.shipping_address.postal_code]
                  .filter(Boolean).join(', ')}
              </p>
            )}
            {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
            {order.shipping_address.email && <p>{order.shipping_address.email}</p>}
          </div>
        </Card>
      )}

      {/* Payment */}
      <Card variant="static" className="flex flex-col gap-3 p-5">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <CreditCard className="size-3.5" /> Payment
        </p>
        <p className="text-sm font-medium">{order.payment_method.label}</p>
      </Card>
    </div>
  )
}
