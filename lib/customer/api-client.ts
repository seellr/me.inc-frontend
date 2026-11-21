'use client'

import type { ZodType } from 'zod'
import { apiFetch } from '@/lib/api/client'
import type { ApiResult } from '@/lib/api/types'

export type { ApiResult } from '@/lib/api/types'

/**
 * Calls the authenticated customer proxy.
 * 401 -> clears the session server-side and redirects to /login?next=…
 */
export function customerFetchClient<T>(
  path: string,
  init: RequestInit & { schema?: ZodType; redirectOn401?: boolean; retry?: boolean } = {},
): Promise<ApiResult<T>> {
  const { schema, redirectOn401, retry, ...requestInit } = init
  return apiFetch<T>(`/api/customer${path}`, {
    ...requestInit,
    schema,
    redirectOn401,
    retry,
  })
}

/** Public storefront proxy (no token). */
export function storeFetchClient<T>(
  path: string,
  init: RequestInit & { schema?: ZodType; retry?: boolean } = {},
): Promise<ApiResult<T>> {
  const { schema, retry, ...requestInit } = init
  return apiFetch<T>(`/api/store${path}`, { ...requestInit, schema, retry })
}
