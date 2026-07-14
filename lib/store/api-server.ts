import 'server-only'
import { getLocale } from 'next-intl/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

export interface StoreApiMeta {
  per_page: number
  next_cursor: string | null
  has_more: boolean
}

export type StoreApiResult<T> =
  | { ok: true; data: T; meta?: StoreApiMeta }
  | { ok: false; message: string; status: number }

// Public storefront endpoints don't need a customer token, but they still
// need x-api-key (global ValidateApiKey middleware) — a secret that can't
// go client-side, so this stays server-only like the admin data layer.
export async function storeFetchServer<T>(path: string, revalidate = 300): Promise<StoreApiResult<T>> {
  const locale = await getLocale()

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'x-api-key': API_KEY,
      'Accept-Language': locale,
      'X-Brand-Id': process.env.BRAND_ID ?? '1',
    },
    next: { revalidate },
  })

  const json = await res.json().catch(() => null)

  if (!res.ok || !json?.success) {
    return { ok: false, message: json?.message ?? `Request failed (${res.status})`, status: res.status }
  }

  return { ok: true, data: json.data as T, meta: json.meta }
}
