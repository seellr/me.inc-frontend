import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { backendJson } from '@/lib/server/backend'

const EmailSchema = z
  .object({
    method: z.literal('email'),
    first_name: z.string().min(2).max(100),
    last_name: z.string().min(2).max(100),
    email: z.string().email().max(180),
    password: z.string().min(8).max(128),
    password_confirmation: z.string().min(8).max(128),
  })
  .strict()
  .refine((data) => data.password === data.password_confirmation, {
    message: 'passwords_do_not_match',
    path: ['password_confirmation'],
  })

const PhoneSchema = z
  .object({
    method: z.literal('phone'),
    first_name: z.string().min(2).max(100),
    last_name: z.string().min(2).max(100),
    phone: z.string().min(7).max(20),
    password: z.string().min(8).max(128),
    password_confirmation: z.string().min(8).max(128),
  })
  .strict()
  .refine((data) => data.password === data.password_confirmation, {
    message: 'passwords_do_not_match',
    path: ['password_confirmation'],
  })

const RegisterSchema = z.discriminatedUnion('method', [EmailSchema, PhoneSchema])

/**
 * Registration always returns 200 for a valid payload. The backend never
 * reveals whether an email/phone already exists, and neither do we.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = RegisterSchema.safeParse(body)

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

  const { method, ...values } = parsed.data
  const payload =
    method === 'email'
      ? {
          first_name: values.first_name,
          last_name: values.last_name,
          email: (values as { email: string }).email,
          password: values.password,
          password_confirmation: values.password_confirmation,
        }
      : {
          first_name: values.first_name,
          last_name: values.last_name,
          phone: (values as { phone: string }).phone,
          password: values.password,
          password_confirmation: values.password_confirmation,
        }

  const result = await backendJson(request, '/customer/auth/register', {
    method: 'POST',
    body: payload,
  })

  if (result.networkError) {
    return NextResponse.json(
      { success: false, message: 'Backend unavailable', error_code: 'backend_unavailable' },
      { status: 502 },
    )
  }

  if (result.status === 422) {
    const json = result.json as Record<string, unknown> | null
    return NextResponse.json(
      {
        success: false,
        message:
          (typeof json?.message === 'string' && json.message) || 'Invalid request',
        error_code: 'validation_error',
        ...(json?.errors ? { errors: json.errors } : {}),
      },
      { status: 422 },
    )
  }

  if (result.status >= 500) {
    return NextResponse.json(
      { success: false, message: 'Registration failed', error_code: 'registration_failed' },
      { status: 502 },
    )
  }

  // 200/201 and even a 409-style duplicate are reported identically.
  return NextResponse.json({
    success: true,
    message:
      'If this account is new, check your email/phone to verify it before logging in.',
    data: { method },
  })
}
