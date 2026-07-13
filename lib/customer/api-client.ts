'use client'

import type { ApiResult } from '@/lib/admin/api-server'

export async function customerFetchClient<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const locale = typeof document !== 'undefined' ? document.documentElement.lang : 'en'

    const res = await fetch(`/api/customer${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-locale': locale,
        ...(init?.headers as Record<string, string> | undefined),
      },
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
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    return { ok: false, message: 'Network error', errorCode: 'network_error', errors: null, status: 0 }
  }
}
