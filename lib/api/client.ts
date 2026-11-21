'use client'

import type { ZodType } from 'zod'
import type { ApiMeta, ApiResult } from './types'
import { loginHref } from '@/lib/utils/next-path'

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  /** Plain object/array -> JSON. FormData/Blob/string are passed as-is. */
  body?: unknown
  /** Optional tolerant response schema. Mismatch => 502 bad_backend_shape. */
  schema?: ZodType
  /** Retry once on network/502/503/504 (safe methods only by default). */
  retry?: boolean
  /** Set false for login/register/me calls that handle 401 themselves. */
  redirectOn401?: boolean
  timeoutMs?: number
}

function currentLocale(): string {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.lang === 'ar' ? 'ar' : 'en'
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  const current = `${window.location.pathname}${window.location.search}`
  window.location.assign(loginHref(currentLocale(), current))
}

function failingPaths(error: { issues: Array<{ path: PropertyKey[] }> }): string[] {
  return error.issues.map((issue) => issue.path.map(String).join('.')).filter(Boolean)
}

function parseEnvelope<T>(json: unknown, status: number): ApiResult<T> {
  if (!json || typeof json !== 'object') {
    return {
      ok: false,
      message: `Unexpected response (${status})`,
      errorCode: 'bad_backend_shape',
      errors: null,
      status,
    }
  }

  const record = json as Record<string, unknown>
  if (record.success === false) {
    return {
      ok: false,
      message: typeof record.message === 'string' ? record.message : `Request failed (${status})`,
      errorCode: typeof record.error_code === 'string' ? record.error_code : 'unknown_error',
      errors: (record.errors as Record<string, string[]> | null) ?? null,
      status,
    }
  }

  return {
    ok: true,
    data: record.data as T,
    meta: record.meta as ApiMeta | undefined,
    status,
  }
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<ApiResult<T>> {
  const {
    body,
    schema,
    retry,
    redirectOn401 = true,
    timeoutMs = 20_000,
    headers,
    ...init
  } = options

  const method = (init.method ?? 'GET').toUpperCase()
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const isRawBody =
    typeof body === 'string' ||
    (typeof Blob !== 'undefined' && body instanceof Blob) ||
    (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer)

  const requestHeaders = new Headers(headers as HeadersInit | undefined)
  requestHeaders.set('Accept', 'application/json')
  requestHeaders.set('x-locale', currentLocale())
  if (body !== undefined && !isFormData) requestHeaders.set('Content-Type', 'application/json')

  const shouldRetry = retry ?? (method === 'GET' || method === 'HEAD')
  const maxAttempts = shouldRetry ? 2 : 1

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(url, {
        ...init,
        method,
        headers: requestHeaders,
        body:
          body === undefined
            ? undefined
            : isFormData || isRawBody
              ? (body as BodyInit)
              : JSON.stringify(body),
        signal: controller.signal,
      })

      if (res.status === 401 && redirectOn401) {
        redirectToLogin()
        return {
          ok: false,
          message: 'Authentication required',
          errorCode: 'unauthenticated',
          errors: null,
          status: 401,
        }
      }

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('retry-after'))
        return {
          ok: false,
          message: 'Too many requests',
          errorCode: 'throttled',
          errors: null,
          status: 429,
          retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
        }
      }

      if (shouldRetry && attempt < maxAttempts && [502, 503, 504].includes(res.status)) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        continue
      }

      if (res.status === 204) {
        return { ok: true, data: undefined as T, status: 204 }
      }

      const contentType = res.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        return {
          ok: false,
          message: `Unexpected response (${res.status})`,
          errorCode: 'bad_backend_shape',
          errors: null,
          status: res.status,
        }
      }

      const text = await res.text()
      const json = text.trim() ? (JSON.parse(text) as unknown) : null
      const result = parseEnvelope<T>(json, res.status)

      if (result.ok && schema) {
        const parsed = schema.safeParse(result.data)
        if (!parsed.success) {
          console.error('[api] bad_backend_shape', failingPaths(parsed.error))
          return {
            ok: false,
            message: 'Unexpected response from the server',
            errorCode: 'bad_backend_shape',
            errors: null,
            status: 502,
          }
        }
        return { ...result, data: parsed.data as T }
      }

      return result
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === 'AbortError'
      if (shouldRetry && attempt < maxAttempts && !aborted) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        continue
      }
      return {
        ok: false,
        message: aborted ? 'Request timed out' : 'Network error',
        errorCode: aborted ? 'timeout' : 'network_error',
        errors: null,
        status: 0,
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    ok: false,
    message: 'Network error',
    errorCode: 'network_error',
    errors: null,
    status: 0,
  }
}

/**
 * Opens an invoice that may be either a JSON `{invoice_url}` response or a PDF
 * body. The caller must handle 401 itself (order pages do).
 */
export async function openInvoiceResponse(res: Response): Promise<boolean> {
  const contentType = res.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const json = await res.json().catch(() => null)
    const url =
      json && typeof json === 'object'
        ? (json as Record<string, unknown>).invoice_url ??
          ((json as Record<string, unknown>).data as Record<string, unknown> | undefined)
            ?.invoice_url
        : null
    if (typeof url === 'string' && url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return true
    }
    return false
  }

  if (contentType.includes('application/pdf')) {
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    window.open(objectUrl, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
    return true
  }

  return false
}
