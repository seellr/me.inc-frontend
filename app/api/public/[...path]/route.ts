import { NextResponse } from 'next/server'

/**
 * Deprecated: this catch-all used to forward any path to the backend with a
 * hardcoded brand id. It is now closed — use the explicit /api/store allowlist.
 */
function gone() {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint has moved to /api/store',
      error_code: 'endpoint_moved',
    },
    { status: 410 },
  )
}

export async function GET() {
  return gone()
}
export async function POST() {
  return gone()
}
export async function PUT() {
  return gone()
}
export async function DELETE() {
  return gone()
}
