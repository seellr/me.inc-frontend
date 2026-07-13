import { NextResponse } from 'next/server'
import { getAdminTokenCookie, clearAdminTokenCookie } from '@/lib/admin/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

export async function POST() {
  const token = await getAdminTokenCookie()

  if (token) {
    await fetch(`${API_URL}/admin/auth/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'x-api-key': API_KEY, Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }

  await clearAdminTokenCookie()
  return NextResponse.json({ success: true })
}
