import { NextRequest, NextResponse } from 'next/server'
import {
  clearCustomerTokenCookie,
  getCustomerTokenCookie,
} from '@/lib/customer/auth'
import { backendJson } from '@/lib/server/backend'

/**
 * Always clears the cookie, even when the backend is unreachable or returns an
 * error. The browser must never stay "logged in" against a dead session.
 */
export async function POST(request: NextRequest) {
  const token = await getCustomerTokenCookie()

  if (token) {
    await backendJson(request, '/customer/auth/logout', {
      method: 'POST',
      token,
    }).catch(() => undefined)
  }

  await clearCustomerTokenCookie()
  return new NextResponse(null, { status: 204 })
}
