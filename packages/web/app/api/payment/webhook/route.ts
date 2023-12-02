import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/src/lib/auth'

export const runtime = 'edge'

export const POST = async (req: NextRequest) => {
  const session = await auth()

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
