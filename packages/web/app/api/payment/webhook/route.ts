import { getSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json('No session', { status: 401 });
  }

  try {
    const json = await req.json();
  } catch {
    return NextResponse.json('Bad request', { status: 400 });
  }

  return NextResponse.json({ hello: 'world' });
};
