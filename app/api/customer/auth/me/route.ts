import { NextRequest, NextResponse } from 'next/server'
import {
  clearCustomerTokenCookie,
  getCustomerTokenCookie,
} from '@/lib/customer/auth'
import { backendJson, isApiKeyFailure } from '@/lib/server/backend'
import { CustomerSchema } from '@/types/dto/customer-auth.dto'

export async function GET(request: NextRequest) {
  const token = await getCustomerTokenCookie()

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Authentication required', error_code: 'unauthenticated' },
      { status: 401 },
    )
  }

  const result = await backendJson(request, '/customer/auth/me', {
    method: 'GET',
    token,
  })

  if (result.networkError) {
    return NextResponse.json(
      { success: false, message: 'Backend unavailable', error_code: 'backend_unavailable' },
      { status: 502 },
    )
  }

  const payload = result.json as Record<string, unknown> | null

  if (result.status === 401) {
    if (isApiKeyFailure(401, payload)) {
      return NextResponse.json(
        { success: false, message: 'Backend unavailable', error_code: 'backend_unavailable' },
        { status: 502 },
      )
    }
    await clearCustomerTokenCookie()
    return NextResponse.json(
      { success: false, message: 'Session expired', error_code: 'unauthenticated' },
      { status: 401 },
    )
  }

  if (!result.ok || !payload || payload.success === false) {
    return NextResponse.json(
      {
        success: false,
        message:
          (typeof payload?.message === 'string' && payload.message) || 'Request failed',
        error_code:
          (typeof payload?.error_code === 'string' && payload.error_code) || 'unknown_error',
      },
      { status: result.status },
    )
  }

  const user = CustomerSchema.safeParse(payload.data)
  if (!user.success) {
    console.error('[auth/me] bad_backend_shape', {
      paths: user.error.issues.map((issue) => issue.path.map(String).join('.')),
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

  return NextResponse.json({ success: true, data: { user: user.data } })
}
