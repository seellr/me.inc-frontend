'use client'

import { apiFetch } from '@/lib/api/client'
import type { ApiResult } from '@/lib/api/types'
import {
  CartCouponResponseSchema,
  CartResponseSchema,
  CartSummaryResponseSchema,
  CouponValidationSchema,
} from '@/types/dto/storefront.dto'
import type { CartCoupon, CartSummaryData } from '@/types/commerce'
import { mapCart, mapCartCoupon, mapCartSummary } from './mappers'
import { clearGuestToken, getGuestToken, getOrCreateGuestToken } from './guest-token'
import { withCartLockRetry } from './errors'

export type CartData = CartSummaryData

function guestHeaders(): Record<string, string> {
  return { 'X-Guest-Token': getOrCreateGuestToken() }
}

function cartBase(isAuthenticated: boolean): string {
  return isAuthenticated ? '/api/customer/cart' : '/api/guest/cart'
}

function headersFor(isAuthenticated: boolean): Record<string, string> {
  return isAuthenticated ? {} : guestHeaders()
}

export async function getCart(isAuthenticated: boolean): Promise<ApiResult<CartData>> {
  const result = await apiFetch<unknown>(cartBase(isAuthenticated), {
    headers: headersFor(isAuthenticated),
    schema: CartResponseSchema,
    redirectOn401: isAuthenticated,
  })
  if (!result.ok) return result
  return { ...result, data: mapCart(result.data as never) }
}

/**
 * Guest carts have no /summary endpoint. Their cart response already carries
 * the totals, so reuse it instead of issuing a 404 request.
 */
export async function getSummary(isAuthenticated: boolean): Promise<ApiResult<CartData>> {
  if (!isAuthenticated) return getCart(false)

  const result = await apiFetch<unknown>('/api/customer/cart/summary', {
    schema: CartSummaryResponseSchema,
    redirectOn401: true,
  })
  if (!result.ok) return result
  return { ...result, data: mapCartSummary(result.data as never) }
}

export async function addItem(
  isAuthenticated: boolean,
  productUlid: string,
  quantity = 1,
): Promise<ApiResult<unknown>> {
  const product_ulid = productUlid.trim()
  if (!product_ulid) {
    return {
      ok: false,
      message: 'Invalid product',
      errorCode: 'validation_error',
      errors: null,
      status: 422,
    }
  }

  return withCartLockRetry(() =>
    apiFetch<unknown>(`${cartBase(isAuthenticated)}/items`, {
      method: 'POST',
      headers: headersFor(isAuthenticated),
      body: { product_ulid, quantity: Math.min(10, Math.max(1, quantity)) },
      redirectOn401: isAuthenticated,
    }),
  )
}

export async function removeItem(
  isAuthenticated: boolean,
  productUlid: string,
): Promise<ApiResult<unknown>> {
  const trimmed = productUlid.trim()
  return withCartLockRetry(() =>
    apiFetch<unknown>(
      `${cartBase(isAuthenticated)}/items/${encodeURIComponent(trimmed)}`,
      {
        method: 'DELETE',
        headers: headersFor(isAuthenticated),
        redirectOn401: isAuthenticated,
      },
    ),
  )
}

export async function applyCoupon(
  isAuthenticated: boolean,
  code: string,
): Promise<ApiResult<CartCoupon>> {
  const result = await apiFetch<unknown>(`${cartBase(isAuthenticated)}/coupon`, {
    method: 'POST',
    headers: headersFor(isAuthenticated),
    body: { code: code.trim().toUpperCase() },
    schema: CartCouponResponseSchema,
    redirectOn401: isAuthenticated,
  })
  if (!result.ok) return result
  return { ...result, data: mapCartCoupon(result.data as never) }
}

export async function removeCoupon(isAuthenticated: boolean): Promise<ApiResult<unknown>> {
  return apiFetch<unknown>(`${cartBase(isAuthenticated)}/coupon`, {
    method: 'DELETE',
    headers: headersFor(isAuthenticated),
    redirectOn401: isAuthenticated,
  })
}

/**
 * Called silently after login. Never fails login, never redirects on 401 and
 * clears the local guest token once the merge succeeded.
 */
export async function mergeGuestCart(): Promise<ApiResult<unknown>> {
  const guestToken = getGuestToken()
  if (!guestToken) {
    return { ok: true, data: undefined, status: 204 }
  }

  const result = await apiFetch<unknown>('/api/guest/cart/merge', {
    method: 'POST',
    headers: { 'X-Guest-Token': guestToken },
    redirectOn401: false,
  })

  if (result.ok) clearGuestToken()
  return result
}

/** Public coupon pre-check: GET /coupons/{code}/validate?subtotal=… */
export async function validateCoupon(
  code: string,
  subtotal: string | number,
): Promise<ApiResult<unknown>> {
  const params = new URLSearchParams({ subtotal: String(subtotal) })
  return apiFetch<unknown>(
    `/api/store/coupons/${encodeURIComponent(code.trim().toUpperCase())}/validate?${params.toString()}`,
    { schema: CouponValidationSchema, redirectOn401: false },
  )
}

// Order helpers live in lib/orders/api.ts; re-exported for existing imports.
export { createOrder, payOrder, getOrderInvoice } from '@/lib/orders/api'
