import { NextRequest, NextResponse } from 'next/server'
import { AdminLoginRequestSchema, AdminLoginResponseSchema } from '@/types/dto/auth.dto'
import { setAdminTokenCookie } from '@/lib/admin/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = AdminLoginRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid request', errors: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const res = await fetch(`${API_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(parsed.data),
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok || !json.success) {
    return NextResponse.json(
      { success: false, message: json.message ?? 'Login failed', error_code: json.error_code ?? 'login_failed' },
      { status: res.status },
    )
  }

  const data = AdminLoginResponseSchema.parse(json.data)
  await setAdminTokenCookie(data.access_token, data.expires_in)

  return NextResponse.json({ success: true, data: { user: data.user } })
}
