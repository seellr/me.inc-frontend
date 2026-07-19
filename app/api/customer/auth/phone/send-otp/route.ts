import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'

const Schema = z.object({ phone: z.string().min(7) })

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 422 })
  }

  const locale = request.headers.get('x-locale') ?? 'ar'
  const res = await fetch(`${BACKEND_API_URL}/customer/auth/phone/send-otp`, {
    method: 'POST',
    headers: backendHeaders(locale),
    body: JSON.stringify({ ...parsed.data, brand_id: 1 }),
  })
  const json = await res.json().catch(() => ({}))
  return NextResponse.json(json, { status: res.status })
}
