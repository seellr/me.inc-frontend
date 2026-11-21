const STORAGE_KEY = 'meinc_guest_token'

export function getGuestToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function getOrCreateGuestToken(): string {
  const existing = getGuestToken()
  if (existing) return existing

  const token = crypto.randomUUID()
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {}
  return token
}

export function clearGuestToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
