import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { backendJson } from '@/lib/server/backend'

const Schema = z.object({ phone: z.string().min(7).max(20) }).strict()

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

  const result = await backendJson(request, '/customer/auth/phone/send-otp', {
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
          (typeof payload?.message === 'string' && payload.message) || 'Could not send code',
        error_code:
          (typeof payload?.error_code === 'string' && payload.error_code) || 'otp_failed',
      },
      { status: result.status },
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Verification code sent',
    data: {},
  })
}
