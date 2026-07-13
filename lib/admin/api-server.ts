import 'server-only'
import { getLocale } from 'next-intl/server'
import { getAdminTokenCookie } from '@/lib/admin/auth'

export interface ApiMeta {
  per_page: number
  next_cursor: string | null
  has_more: boolean
}

export interface ApiSuccess<T> {
  ok: true
  data: T
  meta?: ApiMeta
}

export interface ApiFailure {
  ok: false
  message: string
  errorCode: string
  errors: Record<string, string[]> | null
  status: number
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

export async function adminFetchServer<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const token = await getAdminTokenCookie()
  const locale = await getLocale()

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'Accept-Language': locale,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
}
