import 'server-only'
import { getLocale } from 'next-intl/server'
import { getCustomerTokenCookie } from '@/lib/customer/auth'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'
import type { ApiResult } from '@/lib/admin/api-server'

export async function customerFetchServer<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const token = await getCustomerTokenCookie()
  const locale = await getLocale()

  try {
    const res = await fetch(`${BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        ...backendHeaders(locale, token),
        ...(init?.headers as Record<string, string> | undefined),
      },
      cache: 'no-store',
    })

    const json = await res.json().catch(() => null)

    if (!res.ok || !json?.success) {
      return {
        ok: false,
        message: json?.message ?? `Request failed (${res.status})`,
        errorCode: json?.error_code ?? 'unknown_error',
        errors: json?.errors ?? null,
        status: res.status,
      }
    }

    return { ok: true, data: json.data as T, meta: json.meta }
  } catch (error) {
    console.error('customerFetchServer', { path, error })
    return {
      ok: false,
      message: 'Unable to reach the server',
      errorCode: 'network_error',
      errors: null,
      status: 0,
    }
  }
}
