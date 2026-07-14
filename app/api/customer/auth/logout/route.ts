import { NextRequest, NextResponse } from 'next/server'
import { getCustomerTokenCookie, clearCustomerTokenCookie } from '@/lib/customer/auth'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'

export async function POST(request: NextRequest) {
  const token = await getCustomerTokenCookie()
  const locale = request.headers.get('x-locale') ?? 'en'

  if (token) {
    await fetch(`${BACKEND_API_URL}/customer/auth/logout`, {
      method: 'POST',
      headers: backendHeaders(locale, token),
    }).catch(() => {})
  }

  await clearCustomerTokenCookie()
  return NextResponse.json({ success: true })
}
