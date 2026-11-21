'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Download,
  RefreshCw,
  Truck,
  Loader2,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatMoney } from '@/lib/currency'
import { getOrderInvoice, openInvoice } from '@/lib/orders/api'
import { useDelivery, useOrderPolling, useShipmentTracking } from '@/hooks/useStorefront'
import type { CustomerOrderView } from '@/types/commerce'
import { ORDER_STATUS } from '@/types/commerce'

const STATUS_VARIANT: Record<number, 'eyebrow' | 'new' | 'outline' | 'sale'> = {
  1: 'eyebrow',
  2: 'new',
  3: 'sale',
  4: 'outline',
  5: 'eyebrow',
  6: 'new',
}

function DeliveryDownload({
  productUlid,
  productName,
}: {
  productUlid: string
  productName: string
}) {
  const t = useTranslations('orders.delivery')
  const { delivery, isLoading, error, reload } = useDelivery(productUlid)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t('loading')}
      </div>
    )
  }

  if (error || !delivery) {
    return (
      <div className="flex flex-col gap-2 text-sm">
        <p className="text-muted-foreground">{t('notReady')}</p>
        <Button variant="outline" size="sm" onClick={reload} className="w-fit">
          <RefreshCw className="size-3.5" />
          {t('retry')}
        </Button>
      </div>
    )
  }

  const href = delivery.downloadUrl
    ? delivery.downloadUrl
    : delivery.token
      ? `/api/customer/delivery/download/${encodeURIComponent(delivery.token)}`
      : null

  if (!href) {
    return <p className="text-sm text-muted-foreground">{t('notReady')}</p>
  }

  return (
    <div className="flex flex-col gap-1">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
        aria-label={`${t('download')} ${productName}`}
      >
        <Download className="size-4" />
        {t('download')}
      </a>
      {delivery.remainingDownloads !== null && (
        <span className="text-xs text-muted-foreground">
          {t('remaining', { count: delivery.remainingDownloads })}
        </span>
      )}
      {delivery.expiresAt && (
        <span className="text-xs text-muted-foreground">
          {t('expires', { date: formatDate(delivery.expiresAt, 'en') })}
        </span>
      )}
      <span className="text-xs text-muted-foreground">{t('singleUse')}</span>
    </div>
  )
}

function ShipmentTracking({ shipmentUlid }: { shipmentUlid: string }) {
  const t = useTranslations('orders.shipment')
  const locale = useLocale()
  const { shipment, isLoading, error } = useShipmentTracking(shipmentUlid)

  return (
    <Card className="flex flex-col gap-3 p-5">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Truck className="size-3.5" /> {t('title')}
      </p>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t('loading')}
        </p>
      )}

      {error && <p className="text-sm text-muted-foreground">{error}</p>}

      {shipment && (
        <div className="flex flex-col gap-2 text-sm">
          {shipment.carrier && (
            <p>
              <span className="text-muted-foreground">{t('carrier')}: </span>
              {shipment.carrier}
            </p>
          )}
          {shipment.trackingNumber && (
            <p>
              <span className="text-muted-foreground">{t('trackingNumber')}: </span>
              <span className="font-medium">{shipment.trackingNumber}</span>
            </p>
          )}
          {shipment.estimatedDelivery && (
            <p className="text-muted-foreground">
              {t('estimated', { date: formatDate(shipment.estimatedDelivery, locale) })}
            </p>
          )}
          {shipment.events.length === 0 ? (
            <p className="text-muted-foreground">{t('noEvents')}</p>
          ) : (
            <ol className="mt-2 flex flex-col gap-2 border-s-2 border-border ps-4">
              {shipment.events.map((event, index) => (
                <li key={`${event.status}-${index}`} className="flex flex-col gap-0.5">
                  <span className="font-medium">{event.status}</span>
                  {event.description && (
                    <span className="text-muted-foreground">{event.description}</span>
                  )}
                  {event.occurredAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.occurredAt, locale)}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </Card>
  )
}

export function OrderDetailClient({
  ulid,
  initialOrder,
}: {
  ulid: string
  initialOrder: CustomerOrderView | null
}) {
  const locale = useLocale()
  const t = useTranslations('orders')
  const {
    order,
    isLoading,
    isPolling,
    timedOut,
    error,
    refresh,
    retryPolling,
  } = useOrderPolling(ulid, initialOrder)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <p className="font-semibold">{t('notFound')}</p>
        {error && <p className="text-sm text-muted-foreground">{error}</p>}
        <Button nativeButton={false} render={<Link href="/orders" />} variant="outline">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t('backToOrders')}
        </Button>
      </div>
    )
  }

  const isPaid = order.statusId === ORDER_STATUS.PAID || order.statusId === ORDER_STATUS.COD_CONFIRMED
  const showDelivery = isPaid

  async function handleInvoice() {
    if (invoiceLoading) return
    setInvoiceLoading(true)
    setInvoiceError(null)
    try {
      const result = await getOrderInvoice(order.ulid)
      if (result.ok) openInvoice(result)
      else setInvoiceError(t('invoiceError'))
    } finally {
      setInvoiceLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/orders"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" /> {t('allOrders')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">
            {order.invoiceNumber ?? `#${order.ulid.slice(0, 8).toUpperCase()}`}
          </p>
          {order.createdAt && (
            <p className="text-sm text-muted-foreground">
              {t('placedOn', { date: formatDate(order.createdAt, locale) })}
            </p>
          )}
        </div>
        <Badge
          variant={STATUS_VARIANT[order.statusId ?? 0] ?? 'outline'}
          className="text-sm px-3 py-1"
        >
          {order.statusLabel || (order.statusId ? t(`status.${order.statusId}`) : '')}
        </Badge>
      </div>

      {isPolling && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin" />
          {t('polling')}
        </div>
      )}

      {timedOut && (
        <div role="status" className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">{t('pollTimedOut')}</span>
          <Button variant="outline" size="sm" onClick={retryPolling}>
            <RefreshCw className="size-3.5" /> {t('refresh')}
          </Button>
        </div>
      )}

      <Card className="flex flex-col gap-4 p-5">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Package className="size-3.5" /> {t('items', { count: order.items.length })}
        </p>
        {order.items.map((item) => (
          <div
            key={item.ulid}
            className="flex flex-col gap-2 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {t('quantity', { count: item.quantity })}
                </span>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {formatMoney(item.total, order.currency, locale)}
              </span>
            </div>
            {showDelivery && item.productUlid && (
              <DeliveryDownload productUlid={item.productUlid} productName={item.name} />
            )}
          </div>
        ))}

        <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
          {order.subtotal !== null && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t('subtotal')}</span>
              <span>{formatMoney(order.subtotal, order.currency, locale)}</span>
            </div>
          )}
          {order.discount !== null && Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t('discount')}</span>
              <span>-{formatMoney(order.discount, order.currency, locale)}</span>
            </div>
          )}
          {order.vat !== null && Number(order.vat) > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t('vat')}</span>
              <span>{formatMoney(order.vat, order.currency, locale)}</span>
            </div>
          )}
          {order.shipping !== null && Number(order.shipping) > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t('shipping')}</span>
              <span>{formatMoney(order.shipping, order.currency, locale)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
            <span>{t('total')}</span>
            <span>{formatMoney(order.total, order.currency, locale)}</span>
          </div>
        </div>
      </Card>

      {order.shippingAddress && (
        <Card className="flex flex-col gap-3 p-5">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MapPin className="size-3.5" /> {t('shippingAddress')}
          </p>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {order.shippingAddress.fullName && (
              <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
            )}
            {order.shippingAddress.line1 && <p>{order.shippingAddress.line1}</p>}
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            {(order.shippingAddress.city || order.shippingAddress.country) && (
              <p>
                {[
                  order.shippingAddress.city,
                  order.shippingAddress.country,
                  order.shippingAddress.postalCode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            {order.shippingAddress.email && <p>{order.shippingAddress.email}</p>}
          </div>
        </Card>
      )}

      {order.shipmentUlid && <ShipmentTracking shipmentUlid={order.shipmentUlid} />}

      <Card className="flex flex-col gap-3 p-5">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <CreditCard className="size-3.5" /> {t('payment')}
        </p>
        <p className="text-sm font-medium">{order.paymentMethodLabel}</p>
        {invoiceError && <p className="text-sm text-destructive">{invoiceError}</p>}
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-fit"
          disabled={invoiceLoading}
          onClick={handleInvoice}
        >
          <Download className="size-4" />
          {invoiceLoading ? t('invoiceLoading') : t('invoice')}
        </Button>
      </Card>
    </div>
  )
}
