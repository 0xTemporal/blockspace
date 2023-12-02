import { paymentIntents } from '@code-wallet/client'
import type { CurrencyCode } from '@code-wallet/library'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: NextRequest) => {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  // get Author from article ID
  // get preferences from Author

  const author = { amount: 0.05, currency: 'usd' as CurrencyCode, publicKey: '' }

  const { clientSecret, id: codeId } = await paymentIntents.create({
    mode: 'payment',
    amount: author.amount,
    currency: author.currency,
    destination: author.publicKey,
  })

  // add intent increment here with `codeId`

  return NextResponse.json({ clientSecret })
}
