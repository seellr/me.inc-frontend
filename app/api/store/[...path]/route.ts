import { NextRequest, NextResponse } from 'next/server'
import { handleAllowlistedRequest, type ProxyRule } from '@/lib/server/proxy'

/**
 * Public storefront proxy.
 *
 * Browser -> /api/store/* -> backend. GET-only except analytics/unsubscribe.
 * Nothing outside this table can be reached.
 */
const RULES: ProxyRule[] = [
  { method: 'GET', path: '/home', target: '/home', auth: 'none' },
  { method: 'GET', path: '/brands/:slug', target: '/brands/:slug', auth: 'none' },
  { method: 'GET', path: '/locale', target: '/locale', auth: 'none' },
  { method: 'GET', path: '/locale/defaults', target: '/locale/defaults', auth: 'none' },
  { method: 'GET', path: '/products', target: '/products', auth: 'none' },
  { method: 'GET', path: '/products/:slug', target: '/products/:slug', auth: 'none' },
  { method: 'GET', path: '/product-types', target: '/product-types', auth: 'none' },
  { method: 'GET', path: '/search/products', target: '/search/products', auth: 'none' },
  { method: 'GET', path: '/coupons/:code/validate', target: '/coupons/:code/validate', auth: 'none' },
  { method: 'GET', path: '/shipping-methods', target: '/shipping-methods', auth: 'none' },
  { method: 'GET', path: '/shipments/:ulid/track', target: '/shipments/:ulid/track', auth: 'none' },
  {
    method: 'GET',
    path: '/delivery/download/:token',
    target: '/delivery/download/:token',
    auth: 'none',
    redirect: 'manual',
  },
  { method: 'POST', path: '/analytics/track', target: '/analytics/track', auth: 'optional-customer' },
  { method: 'POST', path: '/email/unsubscribe', target: '/email/unsubscribe', auth: 'none' },
]

async function dispatch(request: NextRequest, path: string[]) {
  return handleAllowlistedRequest(request, { prefix: 'store', path, rules: RULES })
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

// Keep unsupported verbs explicit instead of falling through to a catch-all.
export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed', error_code: 'method_not_allowed' },
    { status: 405 },
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed', error_code: 'method_not_allowed' },
    { status: 405 },
  )
}
