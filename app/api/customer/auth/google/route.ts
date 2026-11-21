import { NextRequest, NextResponse } from 'next/server'
import {
  API_KEY,
  API_URL,
  brandIdFromRequest,
  localeFromRequest,
} from '@/lib/server/backend'

function enabled(): boolean {
  return process.env.GOOGLE_AUTH_ENABLED === 'true'
}

/**
 * Full-page Google OAuth redirect. The backend returns either a 302 Location
 * or a JSON { url } — both are forwarded to the browser.
 */
export async function GET(request: NextRequest) {
  if (!enabled()) {
    return NextResponse.json(
      { success: false, message: 'Google sign-in is disabled', error_code: 'feature_disabled' },
      { status: 404 },
    )
  }

  const brandId = brandIdFromRequest(request)
  const locale = localeFromRequest(request)
  const target = `${API_URL}/customer/auth/google?brand_id=${encodeURIComponent(brandId)}`

  try {
    const res = await fetch(target, {
      headers: {
        Accept: 'application/json',
        'x-api-key': API_KEY,
        'Accept-Language': locale,
        'X-Brand-Id': brandId,
      },
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    })

    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      return NextResponse.redirect(new URL(location, API_URL))
    }

    if (res.ok) {
      const json = await res.json().catch(() => null)
      const record = json && typeof json === 'object' ? (json as Record<string, unknown>) : null
      const data =
        record?.data && typeof record.data === 'object'
          ? (record.data as Record<string, unknown>)
          : null
      const url =
        (typeof record?.url === 'string' && record.url) ||
        (typeof record?.redirect_url === 'string' && record.redirect_url) ||
        (typeof data?.url === 'string' && data.url) ||
        (typeof data?.redirect_url === 'string' && data.redirect_url) ||
        null

      if (url) return NextResponse.redirect(new URL(url, API_URL))
    }

    return NextResponse.json(
      { success: false, message: 'Google sign-in unavailable', error_code: 'oauth_unavailable' },
      { status: 502 },
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'Backend unavailable', error_code: 'backend_unavailable' },
      { status: 502 },
    )
  }
}
