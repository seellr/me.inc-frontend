import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_API_URL, BACKEND_API_KEY } from '@/lib/admin/backend-client'

async function forward(request: NextRequest, path: string[]): Promise<NextResponse> {
  const locale = request.headers.get('x-locale') ?? 'en'
  const guestToken = request.headers.get('x-guest-token') ?? ''
  const search = request.nextUrl.search
  const targetUrl = `${BACKEND_API_URL}/${path.join('/')}${search}`

  const body = request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text()

  const res = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': BACKEND_API_KEY,
      'Accept-Language': locale,
      'X-Brand-Id': '1',
      ...(guestToken ? { 'X-Guest-Token': guestToken } : {}),
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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await params).path)
}
