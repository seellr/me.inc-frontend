import { NextRequest, NextResponse } from 'next/server'
import { ResetPasswordRequestSchema } from '@/types/dto/storefront.dto'
import { backendJson } from '@/lib/server/backend'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = ResetPasswordRequestSchema.safeParse(body)

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

  const result = await backendJson(request, '/customer/auth/password/reset', {
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
          (typeof payload?.message === 'string' && payload.message) ||
          'Unable to reset the password',
        error_code:
          (typeof payload?.error_code === 'string' && payload.error_code) || 'reset_failed',
        ...(payload?.errors ? { errors: payload.errors } : {}),
      },
      { status: result.status },
    )
  }

  return NextResponse.json({ success: true, message: 'Password updated', data: {} })
}
