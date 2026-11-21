import { NextRequest, NextResponse } from 'next/server'
import { backendJson, localeFromRequest } from '@/lib/server/backend'

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/i
const HASH_RE = /^[A-Za-z0-9_-]{8,128}$/

/**
 * The verification link in the email points here. We call the backend with the
 * server-only API key and then redirect the browser to a localized page — the
 * backend URL/key is never exposed.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ulid: string; hash: string }> },
) {
  const { ulid, hash } = await params
  const locale = localeFromRequest(request)
  const base = new URL(`/${locale}/login`, request.url)

  if (!ULID_RE.test(ulid) || !HASH_RE.test(hash)) {
    base.searchParams.set('verify_error', 'invalid_link')
    return NextResponse.redirect(base)
  }

  const result = await backendJson(
    request,
    `/customer/auth/email/verify/${encodeURIComponent(ulid)}/${encodeURIComponent(hash)}`,
    { method: 'GET' },
  )

  if (result.networkError || !result.ok) {
    base.searchParams.set('verify_error', 'verify_failed')
    return NextResponse.redirect(base)
  }

  base.searchParams.set('verified', '1')
  return NextResponse.redirect(base)
}
