import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'
import { CustomerLoginResponseSchema } from '@/types/dto/customer-auth.dto'
import { setCustomerTokenCookie } from '@/lib/customer/auth'

const Schema = z.object({ phone: z.string().min(7), code: z.string().length(6) })

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 422 })
  }

  const locale = request.headers.get('x-locale') ?? 'ar'
  const res = await fetch(`${BACKEND_API_URL}/customer/auth/phone/verify`, {
    method: 'POST',
    headers: backendHeaders(locale),
    body: JSON.stringify({ ...parsed.data, brand_id: 1 }),
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok || !json.success) {
    return NextResponse.json(
      { success: false, message: json.message ?? 'Verification failed' },
      { status: res.status },
    )
  }

  const data = CustomerLoginResponseSchema.parse(json.data)
  await setCustomerTokenCookie(data.access_token, data.expires_in || 3600)
  return NextResponse.json({ success: true, data: { user: data.user } })
}
