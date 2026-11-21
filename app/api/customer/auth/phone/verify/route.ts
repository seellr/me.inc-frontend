import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { backendJson } from '@/lib/server/backend'
import { CustomerLoginResponseSchema } from '@/types/dto/customer-auth.dto'
import { setCustomerTokenCookie } from '@/lib/customer/auth'

const Schema = z
  .object({ phone: z.string().min(7).max(20), code: z.string().length(6) })
  .strict()

function enabled(): boolean {
  return process.env.PHONE_OTP_ENABLED === 'true'
}

export async function POST(request: NextRequest) {
  if (!enabled()) {
    return NextResponse.json(
      { success: false, message: 'Phone OTP is disabled', error_code: 'feature_disabled' },
      { status: 404 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request',
        error_code: 'validation_error',
        errors: parsed.error.flatten(),
      },
      { status: 422 },
    )
  }

  const result = await backendJson(request, '/customer/auth/phone/verify', {
    method: 'POST',
    body: parsed.data,
  })

  if (result.networkError) {
    return NextResponse.json(
      { success: false, message: 'Backend unavailable', error_code: 'backend_unavailable' },
      { status: 502 },
    )
  }

  const payload = result.json as Record<string, unknown> | null

  if (!result.ok || !payload || payload.success === false) {
    return NextResponse.json(
      {
        success: false,
        message:
          (typeof payload?.message === 'string' && payload.message) || 'Verification failed',
        error_code:
          (typeof payload?.error_code === 'string' && payload.error_code) || 'otp_invalid',
      },
      { status: result.status },
    )
  }

  const login = CustomerLoginResponseSchema.safeParse(payload.data)
  if (!login.success) {
    console.error('[auth/phone/verify] bad_backend_shape', {
      paths: login.error.issues.map((issue) => issue.path.map(String).join('.')),
    })
    return NextResponse.json(
      {
        success: false,
        message: 'Unexpected response from the server',
        error_code: 'bad_backend_shape',
      },
      { status: 502 },
    )
  }

  await setCustomerTokenCookie(login.data.access_token, login.data.expires_in ?? 3600)

  return NextResponse.json({ success: true, data: { user: login.data.user } })
}
