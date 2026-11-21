import {
  enumId,
  enumLabel,
  type CustomerOrderResponse,
  type DeliveryResponse,
  type FunnelNextStep,
  type ShipmentTrackResponse,
  type ShippingMethodResponse,
} from '@/types/dto/storefront.dto'
import type {
  CustomerOrderView,
  DeliveryView,
  FunnelStepView,
  ShipmentTrackView,
  ShippingMethodView,
} from '@/types/commerce'

export function mapOrder(raw: CustomerOrderResponse): CustomerOrderView {
  const address = raw.shipping_address ?? null
  return {
    ulid: raw.ulid,
    invoiceNumber: raw.invoice_number ?? null,
    statusId: enumId(raw.status),
    statusLabel: enumLabel(raw.status, ''),
    subtotal: raw.subtotal ?? null,
    discount: raw.discount ?? raw.discount_amount ?? null,
    vat: raw.vat_amount ?? null,
    shipping: raw.shipping_amount ?? null,
    total: raw.total ?? null,
    currency: raw.currency ?? 'SAR',
    paymentMethodLabel: enumLabel(raw.payment_method, ''),
    requiresShipping: raw.requires_shipping ?? false,
    shippingAddress: address
      ? {
          fullName: address.full_name ?? address.name ?? null,
          line1: address.line1 ?? address.address ?? null,
          line2: address.line2 ?? null,
          city: address.city ?? null,
          country: address.country ?? null,
          postalCode: address.postal_code ?? null,
          phone: address.phone ?? null,
          email: address.email ?? null,
        }
      : null,
    items: (raw.items ?? []).map((item) => ({
      ulid: item.ulid ?? item.product_ulid ?? '',
      productUlid: item.product_ulid ?? null,
      name: item.product_name ?? '',
      quantity: item.quantity ?? 1,
      unitPrice: item.unit_price ?? '0',
      total: item.total ?? item.total_price ?? '0',
      image: item.product_image_url ?? null,
      requiresShipping: item.requires_shipping ?? false,
    })),
    createdAt: raw.created_at ?? null,
    notes: raw.notes ?? null,
    shipmentUlid: raw.shipment_ulid ?? raw.shipment?.ulid ?? null,
  }
}

export function mapFunnelStep(raw: FunnelNextStep): FunnelStepView {
  return {
    step: raw.step,
    orderUlid: raw.order_ulid ?? null,
    product: raw.product
      ? {
          ulid: raw.product.ulid,
          name: raw.product.name ?? '',
          image: raw.product.hero_image_url ?? null,
        }
      : null,
    price: raw.price ?? null,
    originalPrice: raw.original_price ?? null,
    timerMinutes: raw.timer_minutes ?? null,
    headline: raw.headline ?? null,
    paymentFailed: raw.payment_failed ?? false,
  }
}

export function mapDelivery(raw: DeliveryResponse): DeliveryView {
  return {
    productUlid: raw.product_ulid ?? null,
    downloadUrl: raw.download_url ?? raw.url ?? null,
    token: raw.token ?? null,
    expiresAt: raw.expires_at ?? null,
    downloadLimit: raw.download_limit ?? null,
    remainingDownloads: raw.remaining_downloads ?? null,
  }
}

function stringOrLabel(value: string | { id: number; label: string } | number | null | undefined): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return value.label
}

export function mapShipmentTrack(raw: ShipmentTrackResponse): ShipmentTrackView {
  return {
    ulid: raw.ulid ?? null,
    trackingNumber: raw.tracking_number ?? null,
    carrier: stringOrLabel(raw.carrier),
    status: stringOrLabel(raw.status),
    estimatedDelivery: raw.estimated_delivery ?? null,
    events: (raw.events ?? []).map((event) => ({
      status: stringOrLabel(event.status) ?? '',
      description: event.description ?? event.label ?? null,
      occurredAt: event.occurred_at ?? event.created_at ?? null,
    })),
  }
}

export function mapShippingMethod(raw: ShippingMethodResponse): ShippingMethodView {
  return {
    id: raw.id ?? null,
    ulid: raw.ulid ?? null,
    code: raw.code ?? null,
    name: raw.name ?? raw.label ?? '',
    description: raw.description ?? null,
    price: raw.price ?? raw.cost ?? null,
    currency: raw.currency ?? null,
    estimatedDelivery: raw.estimated_delivery ?? null,
  }
}
