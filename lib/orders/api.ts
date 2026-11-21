'use client'

import { z } from 'zod'
import { apiFetch, redirectToLogin } from '@/lib/api/client'
import type { ApiResult } from '@/lib/api/types'
import {
  CreateOrderRequestSchema,
  CustomerOrderResponseSchema,
  DeliveryResponseSchema,
  FunnelDecideRequestSchema,
  FunnelNextStepSchema,
  OrderPayResponseSchema,
  PayOrderRequestSchema,
  ShippingMethodsResponseSchema,
  ShipmentTrackResponseSchema,
  type CreateOrderRequest,
  type OrderPayResponse,
} from '@/types/dto/storefront.dto'
import type {
  CustomerOrderView,
  DeliveryView,
  FunnelStepView,
  ShipmentTrackView,
  ShippingMethodView,
} from '@/types/commerce'
import {
  mapDelivery,
  mapFunnelStep,
  mapOrder,
  mapShipmentTrack,
  mapShippingMethod,
} from './mappers'

const OrderListSchema = z.array(CustomerOrderResponseSchema)

function validationFailure(error: z.ZodError): ApiResult<never> {
  const errors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.') || '_'
    errors[key] = [...(errors[key] ?? []), issue.message]
  }
  return {
    ok: false,
    message: 'Invalid request',
    errorCode: 'validation_error',
    errors,
    status: 422,
  }
}

export async function createOrder(
  input: CreateOrderRequest,
): Promise<ApiResult<{ ulid: string }>> {
  const parsed = CreateOrderRequestSchema.safeParse(input)
  if (!parsed.success) return validationFailure(parsed.error)

  return apiFetch<{ ulid: string }>('/api/customer/orders', {
    method: 'POST',
    body: parsed.data,
    redirectOn401: true,
  })
}

export async function listOrders(
  cursor?: string | null,
  perPage = 20,
): Promise<ApiResult<CustomerOrderView[]>> {
  const params = new URLSearchParams({ per_page: String(perPage) })
  if (cursor) params.set('cursor', cursor)

  const result = await apiFetch<unknown>(`/api/customer/orders?${params.toString()}`, {
    schema: OrderListSchema,
    redirectOn401: true,
  })
  if (!result.ok) return result
  return {
    ...result,
    data: (result.data as unknown[]).map((item) => mapOrder(item as never)),
  }
}

export async function getOrder(ulid: string): Promise<ApiResult<CustomerOrderView>> {
  const result = await apiFetch<unknown>(`/api/customer/orders/${encodeURIComponent(ulid)}`, {
    schema: CustomerOrderResponseSchema,
    redirectOn401: true,
  })
  if (!result.ok) return result
  return { ...result, data: mapOrder(result.data as never) }
}

/**
 * Starts payment for an order.
 *
 * `idempotencyKey` must be generated once per payment attempt and reused when
 * the user retries that same attempt. Never generate a new key on retry.
 */
export async function payOrder(
  orderUlid: string,
  idempotencyKey: string,
  method?: number,
): Promise<ApiResult<OrderPayResponse>> {
  const payload = PayOrderRequestSchema.safeParse(method ? { method } : {})
  if (!payload.success) return validationFailure(payload.error)

  return apiFetch<OrderPayResponse>(
    `/api/customer/orders/${encodeURIComponent(orderUlid)}/pay`,
    {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: payload.data,
      schema: OrderPayResponseSchema,
      redirectOn401: true,
    },
  )
}

export interface InvoiceResult {
  ok: boolean
  kind: 'pdf' | 'url' | null
  url?: string
  blob?: Blob
  message?: string
  status: number
}

/**
 * The invoice endpoint may return a PDF body or { invoice_url } (or a data
 * wrapper). Both are handled here.
 */
export async function getOrderInvoice(orderUlid: string): Promise<InvoiceResult> {
  const locale = typeof document === 'undefined' ? 'en' : document.documentElement.lang || 'en'

  try {
    const res = await fetch(
      `/api/customer/orders/${encodeURIComponent(orderUlid)}/invoice`,
      {
        headers: {
          Accept: 'application/json, application/pdf',
          'x-locale': locale === 'ar' ? 'ar' : 'en',
        },
        credentials: 'same-origin',
        cache: 'no-store',
      },
    )

    if (res.status === 401) {
      redirectToLogin()
      return { ok: false, kind: null, message: 'Authentication required', status: 401 }
    }

    const contentType = res.headers.get('content-type') ?? ''

    if (res.ok && contentType.includes('application/pdf')) {
      return { ok: true, kind: 'pdf', blob: await res.blob(), status: res.status }
    }

    const json = await res.json().catch(() => null)
    const record = json && typeof json === 'object' ? (json as Record<string, unknown>) : null
    const data =
      record?.data && typeof record.data === 'object'
        ? (record.data as Record<string, unknown>)
        : null
    const url =
      (typeof record?.invoice_url === 'string' && record.invoice_url) ||
      (typeof data?.invoice_url === 'string' && data.invoice_url) ||
      null

    if (res.ok && url) {
      return { ok: true, kind: 'url', url, status: res.status }
    }

    return {
      ok: false,
      kind: null,
      message:
        (typeof record?.message === 'string' && record.message) ||
        `Invoice unavailable (${res.status})`,
      status: res.status,
    }
  } catch {
    return { ok: false, kind: null, message: 'Network error', status: 0 }
  }
}

export function openInvoice(result: InvoiceResult): void {
  if (!result.ok) return
  if (result.kind === 'url' && result.url) {
    window.open(result.url, '_blank', 'noopener,noreferrer')
    return
  }
  if (result.kind === 'pdf' && result.blob) {
    const objectUrl = URL.createObjectURL(result.blob)
    window.open(objectUrl, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
  }
}

export async function getDelivery(productUlid: string): Promise<ApiResult<DeliveryView>> {
  const result = await apiFetch<unknown>(
    `/api/customer/delivery/${encodeURIComponent(productUlid)}`,
    { schema: DeliveryResponseSchema, redirectOn401: true },
  )
  if (!result.ok) return result
  return { ...result, data: mapDelivery(result.data as never) }
}

/** Public shipment tracking. */
export async function trackShipment(
  shipmentUlid: string,
): Promise<ApiResult<ShipmentTrackView>> {
  const result = await apiFetch<unknown>(
    `/api/store/shipments/${encodeURIComponent(shipmentUlid)}/track`,
    { schema: ShipmentTrackResponseSchema, redirectOn401: false },
  )
  if (!result.ok) return result
  return { ...result, data: mapShipmentTrack(result.data as never) }
}

export async function getShippingMethods(): Promise<ApiResult<ShippingMethodView[]>> {
  const result = await apiFetch<unknown>('/api/store/shipping-methods', {
    schema: ShippingMethodsResponseSchema,
    redirectOn401: false,
  })
  if (!result.ok) return result

  const raw = result.data
  const list = Array.isArray(raw)
    ? raw
    : ((raw as { methods?: unknown[]; data?: unknown[] }).methods ??
      (raw as { data?: unknown[] }).data ??
      [])

  return { ...result, data: list.map((item) => mapShippingMethod(item as never)) }
}

export async function getFunnelNextStep(
  orderUlid: string,
): Promise<ApiResult<FunnelStepView>> {
  const result = await apiFetch<unknown>(
    `/api/customer/funnel/${encodeURIComponent(orderUlid)}/next-step`,
    { schema: FunnelNextStepSchema, redirectOn401: true },
  )
  if (!result.ok) return result
  return { ...result, data: mapFunnelStep(result.data as never) }
}

export async function decideFunnel(
  orderUlid: string,
  step: 'oto' | 'downsell',
  accepted: boolean,
): Promise<ApiResult<FunnelStepView>> {
  const payload = FunnelDecideRequestSchema.safeParse({ accepted })
  if (!payload.success) return validationFailure(payload.error)

  const result = await apiFetch<unknown>(
    `/api/customer/funnel/${encodeURIComponent(orderUlid)}/${step}/decide`,
    {
      method: 'POST',
      body: payload.data,
      schema: FunnelNextStepSchema,
      redirectOn401: true,
    },
  )
  if (!result.ok) return result
  return { ...result, data: mapFunnelStep(result.data as never) }
}

/** Fire-and-forget analytics. Failures are intentionally ignored. */
export function trackAnalytics(event: string, properties: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  void fetch('/api/store/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-locale': document.documentElement.lang || 'en' },
    body: JSON.stringify({ event, ...properties }),
    keepalive: true,
  }).catch(() => {})
}
