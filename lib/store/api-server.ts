import 'server-only'
import { headers } from 'next/headers'
import { getLocale } from 'next-intl/server'
import type { ZodType } from 'zod'
import { API_KEY, API_URL, BRAND_IDS } from '@/lib/server/backend'
import type { ApiMeta, ApiResult } from '@/lib/api/types'

interface StoreFetchOptions {
  revalidate?: number
  schema?: ZodType
}

function failingPaths(error: { issues: Array<{ path: PropertyKey[] }> }): string[] {
  return error.issues.map((issue) => issue.path.map(String).join('.')).filter(Boolean)
}

function resolveBrandId(headerBrand: string | null): string {
  const parsed = Number.parseInt(headerBrand ?? process.env.BRAND_ID ?? '1', 10)
  return (BRAND_IDS as readonly number[]).includes(parsed) ? String(parsed) : '1'
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
 * Server-side public storefront fetch. Used by Server Components only.
 * Never logs response bodies (they can contain customer-adjacent data).
 */
export async function storeFetchServer<T>(
  path: string,
  options: number | StoreFetchOptions = 300,
): Promise<ApiResult<T>> {
  const opts: StoreFetchOptions = typeof options === 'number' ? { revalidate: options } : options
  const revalidate = opts.revalidate ?? 300

  const [locale, requestHeaders] = await Promise.all([getLocale(), headers()])
  const brandId = resolveBrandId(requestHeaders.get('x-brand-id'))
  const language = locale === 'ar' ? 'ar' : 'en'

  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        'x-api-key': API_KEY,
        'Accept-Language': language,
        'X-Brand-Id': brandId,
      },
      ...(revalidate > 0 ? { next: { revalidate } } : { cache: 'no-store' as const }),
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
    if (opts.schema) {
      const parsed = opts.schema.safeParse(data)
      if (!parsed.success) {
        console.error('[storeFetchServer] bad_backend_shape', {
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
    console.error('[storeFetchServer] unreachable', { path, error: String(error) })
    return {
      ok: false,
      message: 'Unable to reach the server',
      errorCode: 'backend_unavailable',
      errors: null,
      status: 502,
    }
  }
}
