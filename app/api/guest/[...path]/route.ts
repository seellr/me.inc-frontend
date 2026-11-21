import { NextRequest, NextResponse } from 'next/server'
import { handleAllowlistedRequest, type ProxyRule } from '@/lib/server/proxy'

/**
 * Guest cart proxy. Every rule requires a UUID X-Guest-Token, except that the
 * merge call may also carry the customer token so the backend can attach the
 * guest cart to the freshly logged-in customer.
 */
const RULES: ProxyRule[] = [
  { method: 'GET', path: '/cart', target: '/guest/cart', auth: 'guest' },
  { method: 'POST', path: '/cart/items', target: '/guest/cart/items', auth: 'guest' },
  {
    method: 'DELETE',
    path: '/cart/items/:productUlid',
    target: '/guest/cart/items/:productUlid',
    auth: 'guest',
  },
  { method: 'POST', path: '/cart/coupon', target: '/guest/cart/coupon', auth: 'guest' },
  { method: 'DELETE', path: '/cart/coupon', target: '/guest/cart/coupon', auth: 'guest' },
  { method: 'POST', path: '/cart/merge', target: '/guest/cart/merge', auth: 'guest' },
]

async function dispatch(request: NextRequest, path: string[]) {
  return handleAllowlistedRequest(request, { prefix: 'guest', path, rules: RULES })
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
