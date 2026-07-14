import { NextRequest, NextResponse } from 'next/server'
import { getCustomerTokenCookie } from '@/lib/customer/auth'
import { BACKEND_API_URL, backendHeaders } from '@/lib/admin/backend-client'

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const token = await getCustomerTokenCookie()

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthenticated', error_code: 'unauthenticated' }, { status: 401 })
  }

  const locale = request.headers.get('x-locale') ?? 'en'
  const search = request.nextUrl.search
  const targetUrl = `${BACKEND_API_URL}/${path.join('/')}${search}`

  const body = request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text()

  const res = await fetch(targetUrl, {
    method: request.method,
    headers: backendHeaders(locale, token),
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
