import 'server-only'
import { BACKEND_BASE_URL } from './backend'

/**
 * The API may return absolute URLs or paths like "/storage/products/x.webp".
 * Relative media is resolved against BACKEND_BASE_URL (origin only) so the
 * API key is never involved in serving images.
 */
export function mediaUrl(value: string | null | undefined): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`
  return `${BACKEND_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`
}
