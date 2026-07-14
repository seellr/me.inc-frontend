import { NextRequest, NextResponse } from 'next/server'
import { CustomerRegisterRequestSchema } from '@/types/dto/customer-auth.dto'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = CustomerRegisterRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid request', errors: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const locale = request.headers.get('x-locale') ?? 'en'

  const res = await fetch(`${BACKEND_API_URL}/customer/auth/register`, {
    method: 'POST',
    headers: backendHeaders(locale),
    body: JSON.stringify({ ...parsed.data, brand_id: 1 }),
  })
  const json = await res.json().catch(() => ({}))

  return NextResponse.json(json, { status: res.status })
}
