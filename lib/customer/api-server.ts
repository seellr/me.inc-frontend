import 'server-only'
import { headers } from 'next/headers'
import { getLocale } from 'next-intl/server'
import type { ZodType } from 'zod'
import { getCustomerTokenCookie } from '@/lib/customer/auth'
import { API_KEY, API_URL, BRAND_IDS } from '@/lib/server/backend'
import type { ApiMeta, ApiResult } from '@/lib/api/types'

interface CustomerFetchOptions {
  schema?: ZodType
  method?: string
  body?: unknown
}

function failingPaths(error: { issues: Array<{ path: PropertyKey[] }> }): string[] {
  return error.issues.map((issue) => issue.path.map(String).join('.')).filter(Boolean)
}

function parseJson(text: string): Record<string, unknown> | null {
  if (!text.trim()) return null
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Server-side authenticated customer fetch (Server Components).
 * The token stays in the httpOnly cookie and is only attached server-side.
 */
export async function customerFetchServer<T>(
  path: string,
  options: CustomerFetchOptions = {},
): Promise<ApiResult<T>> {
  const [token, locale, requestHeaders] = await Promise.all([
    getCustomerTokenCookie(),
    getLocale(),
    headers(),
  ])

  if (!token) {
    return {
      ok: false,
      message: 'Authentication required',
      errorCode: 'unauthenticated',
      errors: null,
      status: 401,
    }
  }

  const parsedBrand = Number.parseInt(requestHeaders.get('x-brand-id') ?? process.env.BRAND_ID ?? '1', 10)
  const brandId = (BRAND_IDS as readonly number[]).includes(parsedBrand) ? String(parsedBrand) : '1'

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'x-api-key': API_KEY,
        'Accept-Language': locale === 'ar' ? 'ar' : 'en',
        'X-Brand-Id': brandId,
        Authorization: `Bearer ${token}`,
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    })

    if (res.status === 204) {
      return { ok: true, data: undefined as T, status: 204 }
    }

    const json = parseJson(await res.text())

    if (!res.ok || !json || json.success === false) {
      return {
        ok: false,
        message: (json?.message as string | undefined) ?? `Request failed (${res.status})`,
        errorCode: (json?.error_code as string | undefined) ?? 'unknown_error',
        errors: (json?.errors as Record<string, string[]> | null | undefined) ?? null,
        status: res.status,
      }
    }

    const data = json.data as T
    if (options.schema) {
      const parsed = options.schema.safeParse(data)
      if (!parsed.success) {
        console.error('[customerFetchServer] bad_backend_shape', {
          path,
          paths: failingPaths(parsed.error),
        })
        return {
          ok: false,
          message: 'Unexpected response from the server',
          errorCode: 'bad_backend_shape',
          errors: null,
          status: 502,
        }
      }
      return {
        ok: true,
        data: parsed.data as T,
        meta: json.meta as ApiMeta | undefined,
        status: res.status,
      }
    }

    return {
      ok: true,
      data,
      meta: json.meta as ApiMeta | undefined,
      status: res.status,
    }
  } catch (error) {
    console.error('[customerFetchServer] unreachable', { path, error: String(error) })
    return {
      ok: false,
      message: 'Unable to reach the server',
      errorCode: 'backend_unavailable',
      errors: null,
      status: 502,
    }
  }
}
