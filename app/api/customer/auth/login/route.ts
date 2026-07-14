import { NextRequest, NextResponse } from 'next/server'
import { CustomerLoginRequestSchema, CustomerLoginResponseSchema } from '@/types/dto/customer-auth.dto'
import { setCustomerTokenCookie } from '@/lib/customer/auth'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = CustomerLoginRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid request', errors: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const locale = request.headers.get('x-locale') ?? 'en'

  const res = await fetch(`${BACKEND_API_URL}/customer/auth/login`, {
    method: 'POST',
    headers: backendHeaders(locale),
    body: JSON.stringify({ ...parsed.data, brand_id: 1 }),
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok || !json.success) {
    return NextResponse.json(
      { success: false, message: json.message ?? 'Login failed', error_code: json.error_code ?? 'login_failed' },
      { status: res.status },
    )
  }

  const data = CustomerLoginResponseSchema.parse(json.data)
  const rememberMe = !!(body as Record<string, unknown>)?.remember_me
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : (data.expires_in || 60 * 60)
  await setCustomerTokenCookie(data.access_token, maxAge)

  return NextResponse.json({ success: true, data: { user: data.user } })
}
