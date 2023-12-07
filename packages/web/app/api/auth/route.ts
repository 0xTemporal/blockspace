import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { NextRequest } from 'next/server'

import { defaultSession, getSession } from '@/src/lib/session'

export async function GET(request: NextRequest) {
  const now: Date = new Date()
  const uri = request.nextUrl.toString()
  const currentUrl = new URL(uri)
  const domain = currentUrl.host

  // Convert the Date object to a string
  const currentDateTime = now.toISOString()

  // signInData can be kept empty in most cases: all fields are optional
  // const signInData: SolanaSignInInput = {};

  const signInData: SolanaSignInInput = {
    domain,
    statement:
      'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
    version: '1',
    nonce: 'oBbLoEldZs',
    chainId: 'mainnet',
    issuedAt: currentDateTime,
    resources: ['https://example.com', 'https://phantom.app/'],
  }

  return Response.json(signInData)
}

export async function POST(request: NextRequest) {
  try {
    const { input, output } = (await request.json()) as { input: SolanaSignInInput; output: SolanaSignInOutput }

    const isValid = verifySignIn(input, output)

    console.log(isValid)

    // if (!isValid) {
    //   return Response.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const session = await getSession()

    session.isLoggedIn = true
    session.publicKey = output.account.address

    return Response.json({ isValid, session })
  } catch (e) {
    console.log(e)

    // return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }
}

// logout
export async function DELETE() {
  const session = await getSession()

  session.destroy()

  return Response.json(defaultSession)
}
