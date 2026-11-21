import 'server-only'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-only backend access.
 *
 * The browser never talks to the backend directly. Every request goes through
 * a Next route handler which adds the API key, the brand header and (when
 * present) the customer token read from the httpOnly cookie.
 *
 * Nothing in this module may be imported from client code.
 */

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export const API_URL = RAW_API_URL.replace(/\/+$/, '')
export const API_KEY = process.env.API_KEY ?? ''

function originOf(value: string): string {
  try {
    return new URL(value).origin
  } catch {
    return ''
  }
}

/** Origin only — used to turn relative media paths into absolute URLs. */
export const BACKEND_BASE_URL = (
  process.env.BACKEND_BASE_URL || originOf(API_URL)
).replace(/\/+$/, '')

export type AppLocale = 'ar' | 'en'

export const BRAND_IDS = [1, 2, 3] as const
export type BrandId = (typeof BRAND_IDS)[number]

export function isBrandId(value: unknown): value is BrandId {
  return typeof value === 'number' && (BRAND_IDS as readonly number[]).includes(value)
}

/**
 * Brand comes from the X-Brand-Id header (validated to 1..3). Falls back to
 * BRAND_ID so server-rendered pages without an incoming header still work.
 */
export function brandIdFromRequest(request: NextRequest | Request): string {
  const raw = request.headers.get('x-brand-id') ?? process.env.BRAND_ID ?? '1'
  const parsed = Number.parseInt(raw, 10)
  return isBrandId(parsed) ? String(parsed) : '1'
}

/** Accept-Language is restricted to ar|en — the backend 4xxs anything else. */
export function localeFromRequest(request: NextRequest | Request): AppLocale {
  const raw = (
    request.headers.get('accept-language') ??
    request.headers.get('x-locale') ??
    'en'
  ).toLowerCase()
  return raw.startsWith('ar') ? 'ar' : 'en'
}

const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export interface BackendHeadersInput {
  request: NextRequest | Request
  token?: string | null
  guestToken?: string | null
  hasBody?: boolean
  contentType?: string | null
}

/**
 * Builds the exact header set the backend expects. Never forwards cookies or
 * arbitrary client headers.
 */
export function buildBackendHeaders({
  request,
  token,
  guestToken,
  hasBody = false,
  contentType,
}: BackendHeadersInput): Headers {
  const headers = new Headers({
    Accept: 'application/json',
    'x-api-key': API_KEY,
    'Accept-Language': localeFromRequest(request),
    'X-Brand-Id': brandIdFromRequest(request),
  })

  const isMultipart = (contentType ?? '').toLowerCase().includes('multipart/form-data')
  if (hasBody && !isMultipart) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (guestToken) headers.set('X-Guest-Token', guestToken)

  return headers
}

export interface BackendJsonResult<T = unknown> {
  ok: boolean
  status: number
  json: T | null
  text: string
  networkError: boolean
}

/**
 * JSON request helper for the dedicated auth route handlers.
 * Returns the parsed envelope (or null) and never throws.
 */
export async function backendJson<T = unknown>(
  request: NextRequest,
  path: string,
  init: {
    method?: string
    body?: unknown
    token?: string | null
    guestToken?: string | null
    timeoutMs?: number
  } = {},
): Promise<BackendJsonResult<T>> {
  const method = (init.method ?? 'POST').toUpperCase()
  const hasBody = init.body !== undefined && BODY_METHODS.has(method)
  const url = `${API_URL}${path}${request.nextUrl.search}`

  try {
    const res = await fetch(url, {
      method,
      headers: buildBackendHeaders({
        request,
        token: init.token,
        guestToken: init.guestToken,
        hasBody,
      }),
      body: hasBody ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(init.timeoutMs ?? 20_000),
    })

    const text = await res.text()
    let json: T | null = null
    if (text.trim()) {
      try {
        json = JSON.parse(text) as T
      } catch {
        json = null
      }
    }

    return { ok: res.ok, status: res.status, json, text, networkError: false }
  } catch (error) {
    console.error('[backend] unreachable', { method, path, error: String(error) })
    return { ok: false, status: 502, json: null, text: '', networkError: true }
  }
}

export interface ProxyOptions {
  /** Backend path, e.g. "/guest/cart/items". */
  path: string
  method?: string
  token?: string | null
  guestToken?: string | null
  /** "manual" is required for gateway/download redirects we must pass through. */
  redirect?: RequestRedirect
  timeoutMs?: number
}

/**
 * Forwards the incoming request to the backend and passes the response through
 * untouched (status, JSON envelope, PDF, redirect or 204).
 */
export async function proxyToBackend(
  request: NextRequest,
  options: ProxyOptions,
): Promise<NextResponse> {
  const method = (options.method ?? request.method).toUpperCase()
  const url = `${API_URL}${options.path}${request.nextUrl.search}`
  const contentType = request.headers.get('content-type')

  let body: BodyInit | undefined
  if (BODY_METHODS.has(method)) {
    if ((contentType ?? '').toLowerCase().includes('multipart/form-data')) {
      // Omit Content-Type for multipart, per the backend contract.
      body = await request.arrayBuffer()
    } else {
      const text = await request.text()
      if (text) body = text
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers: buildBackendHeaders({
        request,
        token: options.token,
        guestToken: options.guestToken,
        hasBody: body !== undefined,
        contentType,
      }),
      body,
      redirect: options.redirect ?? 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(options.timeoutMs ?? 20_000),
    })

    return await passThrough(res)
  } catch (error) {
    console.error('[proxy] backend unreachable', { method, path: options.path, error: String(error) })
    return NextResponse.json(
      {
        success: false,
        message: 'Backend unavailable',
        error_code: 'backend_unavailable',
      },
      { status: 502 },
    )
  }
}

const PASSTHROUGH_HEADERS = [
  'content-type',
  'content-disposition',
  'cache-control',
  'location',
  'retry-after',
] as const

async function passThrough(res: Response): Promise<NextResponse> {
  const status = res.status

  if (status === 204 || status === 205) {
    return new NextResponse(null, { status })
  }

  const contentType = res.headers.get('content-type') ?? ''

  // Gateway / single-use download redirect — pass the Location through so the
  // browser performs the redirect (not fetch).
  if (status >= 300 && status < 400) {
    const location = res.headers.get('location')
    return new NextResponse(null, {
      status,
      headers: location ? { location } : undefined,
    })
  }

  if (contentType.includes('application/json')) {
    const text = await res.text()
    if (!text.trim()) return new NextResponse(null, { status })
    try {
      return NextResponse.json(JSON.parse(text), { status })
    } catch {
      // A 200 with malformed JSON is still better surfaced as-is than swallowed.
      return new NextResponse(text, {
        status,
        headers: { 'content-type': contentType },
      })
    }
  }

  // PDFs and other binaries are buffered so the body can be returned reliably
  // from a route handler.
  const buffer = await res.arrayBuffer()
  const headers = new Headers()
  for (const name of PASSTHROUGH_HEADERS) {
    const value = res.headers.get(name)
    if (value) headers.set(name, value)
  }
  return new NextResponse(buffer, { status, headers })
}

/**
 * A bare 401 {"message":"Wrong way!"} means the API key is wrong — it is NOT a
 * customer session expiry and must never clear the customer cookie.
 */
export function isApiKeyFailure(status: number, json: unknown): boolean {
  if (status !== 401 || !json || typeof json !== 'object') return false
  const record = json as Record<string, unknown>
  return record.message === 'Wrong way!' && !record.error_code && !record.success
}

/** Customer 401s that should clear the cookie and send the user to /login. */
export function isCustomerSessionFailure(status: number, json: unknown): boolean {
  if (status !== 401) return false
  if (isApiKeyFailure(status, json)) return false
  if (!json || typeof json !== 'object') return true
  const record = json as Record<string, unknown>
  return record.success === false || typeof record.error_code === 'string'
}
