import { NextRequest, NextResponse } from 'next/server'
import { handleAllowlistedRequest, type ProxyRule } from '@/lib/server/proxy'

/**
 * Authenticated customer proxy.
 *
 * /api/customer/auth/* has dedicated route handlers (login, logout, me, …).
 * Everything below requires the httpOnly customer_token cookie.
 */
const RULES: ProxyRule[] = [
  { method: 'GET', path: '/cart', target: '/cart', auth: 'customer' },
  { method: 'POST', path: '/cart/items', target: '/cart/items', auth: 'customer' },
  {
    method: 'DELETE',
    path: '/cart/items/:productUlid',
    target: '/cart/items/:productUlid',
    auth: 'customer',
  },
  { method: 'POST', path: '/cart/coupon', target: '/cart/coupon', auth: 'customer' },
  { method: 'DELETE', path: '/cart/coupon', target: '/cart/coupon', auth: 'customer' },
  { method: 'GET', path: '/cart/summary', target: '/cart/summary', auth: 'customer' },

  { method: 'POST', path: '/orders', target: '/orders', auth: 'customer' },
  { method: 'GET', path: '/orders', target: '/orders', auth: 'customer' },
  { method: 'GET', path: '/orders/:ulid', target: '/orders/:ulid', auth: 'customer' },
  { method: 'POST', path: '/orders/:ulid/pay', target: '/orders/:ulid/pay', auth: 'customer' },
  { method: 'GET', path: '/orders/:ulid/invoice', target: '/orders/:ulid/invoice', auth: 'customer' },
  {
    method: 'POST',
    path: '/orders/:ulid/shipment',
    target: '/orders/:ulid/shipment',
    auth: 'customer',
  },

  {
    method: 'GET',
    path: '/funnel/:orderUlid/next-step',
    target: '/funnel/:orderUlid/next-step',
    auth: 'customer',
  },
  {
    method: 'POST',
    path: '/funnel/:orderUlid/oto/decide',
    target: '/funnel/:orderUlid/oto/decide',
    auth: 'customer',
  },
  {
    method: 'POST',
    path: '/funnel/:orderUlid/downsell/decide',
    target: '/funnel/:orderUlid/downsell/decide',
    auth: 'customer',
  },

  { method: 'GET', path: '/delivery/:productUlid', target: '/delivery/:productUlid', auth: 'customer' },
  {
    method: 'GET',
    path: '/delivery/download/:token',
    target: '/delivery/download/:token',
    auth: 'customer',
    redirect: 'manual',
  },
]

async function dispatch(request: NextRequest, path: string[]) {
  return handleAllowlistedRequest(request, { prefix: 'customer', path, rules: RULES })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return dispatch(request, (await params).path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return dispatch(request, (await params).path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return dispatch(request, (await params).path)
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed', error_code: 'method_not_allowed' },
    { status: 405 },
  )
}
