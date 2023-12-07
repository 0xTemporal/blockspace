import { NextRequest, NextResponse } from 'next/server'

import { getSession } from '@/src/lib/session'

export const runtime = 'edge'

export const POST = async (req: NextRequest) => {
  const session = await getSession()

  if (!session) {
    return NextResponse.json('No session', { status: 401 })
  }

  try {
    const json = await req.json()
  } catch {
    return NextResponse.json('Bad request', { status: 400 })
  }

  return NextResponse.json({ hello: 'world' })
}
