/**
 * Validates a post-login redirect target. Only same-origin, absolute paths are
 * allowed — "//evil.com", "https://evil.com" and backslash tricks are rejected.
 */
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return null
  if (trimmed.startsWith('//')) return null
  if (trimmed.includes('\\')) return null
  // Control characters can be used for header/URL smuggling.
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null
  return trimmed
}

/** Builds the login URL for a locale, preserving a safe `next` target. */
export function loginHref(locale: string, next?: string | null): string {
  const safe = safeNextPath(next)
  return `/${locale}/login${safe ? `?next=${encodeURIComponent(safe)}` : ''}`
}
