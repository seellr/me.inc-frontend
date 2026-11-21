import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { getCustomerTokenCookie, clearCustomerTokenCookie } from '@/lib/customer/auth'
import { isCustomerSessionFailure, proxyToBackend } from './backend'

export type ProxyAuth = 'none' | 'customer' | 'guest' | 'optional-customer'

export interface ProxyRule {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Path relative to the proxy prefix, e.g. "/cart/items/:productUlid". */
  path: string
  /** Backend path, e.g. "/cart/items/:productUlid". */
  target: string
  auth?: ProxyAuth
  /** Pass gateway/download redirects through instead of following them. */
  redirect?: RequestRedirect
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

function matchPath(pattern: string, actual: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean)
  const actualParts = actual.split('/').filter(Boolean)
  if (patternParts.length !== actualParts.length) return null

  const params: Record<string, string> = {}
  for (let i = 0; i < patternParts.length; i++) {
    const expected = patternParts[i]
    const received = actualParts[i]
    if (expected.startsWith(':')) {
      const name = expected.slice(1)
      if (!received) return null
      params[name] = received
      continue
    }
    if (expected !== received) return null
  }
  return params
}

function buildTarget(target: string, params: Record<string, string>): string {
  return target.replace(/:([A-Za-z0-9_]+)/g, (_, name: string) => {
    const value = params[name]
    return value ? encodeURIComponent(value) : ''
  })
}

export interface AllowlistRequestOptions {
  /** "guest" | "customer" | "store" */
  prefix: string
  /** Captured catch-all segments (without the prefix). */
  path: string[]
  rules: ProxyRule[]
  method?: string
}

/**
 * Explicit method + path allowlist. A catch-all route is only used as a
 * dispatcher — unknown paths are rejected instead of blindly forwarded.
 *
 * NOTE: Next.js does not include the folder name in a catch-all's params, so
 * the prefix ("guest"/"customer"/"store") is prepended here.
 */
export async function handleAllowlistedRequest(
  request: NextRequest,
  { prefix, path, rules, method }: AllowlistRequestOptions,
): Promise<NextResponse> {
  const requestMethod = (method ?? request.method).toUpperCase()

  const decoded = path.map((segment) => safeDecode(segment))
  if (decoded.some((segment) => segment === null || segment === '' || segment.includes('..'))) {
    return NextResponse.json(
      { success: false, message: 'Not found', error_code: 'not_found' },
      { status: 404 },
    )
  }

  const actualPath = `/${(decoded as string[]).join('/')}`
  const rule = rules.find(
    (candidate) =>
      candidate.method === requestMethod &&
      matchPath(candidate.path, actualPath) !== null,
  )

  if (!rule) {
    return NextResponse.json(
      { success: false, message: 'Not found', error_code: 'not_found' },
      { status: 404 },
    )
  }

  const params = matchPath(rule.path, actualPath) ?? {}
  const target = buildTarget(rule.target, params)
  const auth = rule.auth ?? (prefix === 'customer' ? 'customer' : prefix === 'guest' ? 'guest' : 'none')

  const guestTokenHeader = request.headers.get('x-guest-token')
  const customerToken = await getCustomerTokenCookie()

  let guestToken: string | null = null
  if (auth === 'guest' || prefix === 'guest') {
    if (!guestTokenHeader || !UUID_RE.test(guestTokenHeader)) {
      return NextResponse.json(
        {
          success: false,
          message: 'A valid guest token is required',
          error_code: 'guest_token_required',
        },
        { status: 400 },
      )
    }
    guestToken = guestTokenHeader
  }

  if (auth === 'customer' && !customerToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication required',
        error_code: 'unauthenticated',
      },
      { status: 401 },
    )
  }

  const response = await proxyToBackend(request, {
    path: target,
    method: requestMethod,
    token: auth === 'none' ? null : customerToken,
    guestToken,
    redirect: rule.redirect,
  })

  // Only clear the customer cookie for genuine session failures, never for a
  // bare 401 caused by a bad API key.
  if (
    response.status === 401 &&
    (auth === 'customer' || auth === 'optional-customer') &&
    customerToken
  ) {
    const body = await response.clone().json().catch(() => null)
    if (isCustomerSessionFailure(401, body)) {
      await clearCustomerTokenCookie()
    }
  }

  return response
}
