import { NextRequest, NextResponse } from 'next/server'
import { getLocale } from 'next-intl/server'
import { getAdminTokenCookie } from '@/lib/admin/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const API_KEY = process.env.API_KEY ?? ''

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const token = await getAdminTokenCookie()

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthenticated', error_code: 'unauthenticated' }, { status: 401 })
  }

  const locale = await getLocale()
  const search = request.nextUrl.search
  const targetUrl = `${API_URL}/admin/${path.join('/')}${search}`

  const body = request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text()

  const res = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'Accept-Language': locale,
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  const json = await res.json().catch(() => ({}))
  return NextResponse.json(json, { status: res.status })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
