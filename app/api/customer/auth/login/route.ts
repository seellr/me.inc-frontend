import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  CustomerLoginRequestSchema,
  CustomerLoginResponseSchema,
} from '@/types/dto/customer-auth.dto'
import { setCustomerTokenCookie } from '@/lib/customer/auth'
import { backendJson } from '@/lib/server/backend'

const THIRTY_DAYS = 30 * 24 * 60 * 60

function validationFailure(error: z.ZodError): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: 'Invalid request',
      error_code: 'validation_error',
      errors: error.flatten(),
    },
    { status: 422 },
  )
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = CustomerLoginRequestSchema.safeParse(body)
  if (!parsed.success) return validationFailure(parsed.error)

  const { identifier, password, remember_me } = parsed.data

  const result = await backendJson(request, '/customer/auth/login', {
    method: 'POST',
    body: { identifier, password },
  })

  if (result.networkError) {
    return NextResponse.json(
      { success: false, message: 'Backend unavailable', error_code: 'backend_unavailable' },
      { status: 502 },
    )
  }

  const payload = result.json as Record<string, unknown> | null

  // Email not verified is a normal, actionable state — not a failed login.
  if (result.status === 403 && payload?.error_code === 'auth_email_not_verified') {
    return NextResponse.json(
      {
        success: false,
        message:
          (typeof payload.message === 'string' && payload.message) ||
          'Please verify your email before logging in.',
        error_code: 'auth_email_not_verified',
        requires_email_verification: true,
      },
      { status: 403 },
    )
  }

  if (!result.ok || !payload || payload.success === false) {
    return NextResponse.json(
      {
        success: false,
        message:
          (typeof payload?.message === 'string' && payload.message) || 'Login failed',
        error_code:
          (typeof payload?.error_code === 'string' && payload.error_code) || 'login_failed',
        ...(payload?.errors ? { errors: payload.errors } : {}),
      },
      { status: result.status },
    )
  }

  const login = CustomerLoginResponseSchema.safeParse(payload.data)
  if (!login.success) {
    console.error('[auth/login] bad_backend_shape', {
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

  const expiresIn = login.data.expires_in ?? 60 * 60
  await setCustomerTokenCookie(
    login.data.access_token,
    remember_me ? THIRTY_DAYS : expiresIn,
  )

  // The token is never returned to the browser in a JSON body.
  return NextResponse.json({
    success: true,
    message: 'Logged in',
    data: { user: login.data.user },
  })
}
