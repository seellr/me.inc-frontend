import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'

const Schema = z.object({
  method: z.enum(['email', 'phone']),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  email: z.string().email().max(180).optional(),
  phone: z.string().min(7).max(20).optional(),
  password: z.string().min(8).max(128),
  password_confirmation: z.string().min(8).max(128),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid request', errors: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const locale = request.headers.get('x-locale') ?? 'ar'
  const { method, ...rest } = parsed.data

  const res = await fetch(`${BACKEND_API_URL}/customer/auth/register`, {
    method: 'POST',
    headers: backendHeaders(locale),
    body: JSON.stringify({ ...rest, brand_id: 1 }),
  })
  const json = await res.json().catch(() => ({}))

  return NextResponse.json({ ...json, method }, { status: res.status })
}
