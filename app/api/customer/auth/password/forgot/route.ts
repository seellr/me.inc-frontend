import { NextRequest, NextResponse } from 'next/server'
import { ForgotPasswordRequestSchema } from '@/types/dto/storefront.dto'
import { backendJson } from '@/lib/server/backend'

/**
 * Always 200, whether or not the email exists. This prevents account
 * enumeration. The backend does the same; we only surface a generic message.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = ForgotPasswordRequestSchema.safeParse(body)

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

  await backendJson(request, '/customer/auth/password/forgot', {
    method: 'POST',
    body: parsed.data,
  }).catch(() => undefined)

  return NextResponse.json({
    success: true,
    message: 'If an account exists for that email, a reset link has been sent.',
    data: {},
  })
}
