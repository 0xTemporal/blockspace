import { SigninMessage } from './signin-message'
import { MessageSignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import { signIn } from 'next-auth/react'

export const signInWithSolana = async (
  publicKey: PublicKey,
  signMessage: MessageSignerWalletAdapterProps['signMessage'],
) => {
  try {
    const res = await fetch('/api/auth/csrf')

    const { csrfToken } = await res.json()

    if (!publicKey || !csrfToken || !signMessage) {
      return false
    }

    const message = new SigninMessage({
      domain: window.location.host,
      publicKey: publicKey?.toBase58(),
      statement: `Sign this message to sign in to the app.`,
      nonce: csrfToken,
    })

    const data = new TextEncoder().encode(message.prepare())
    const signature = await signMessage(data)
    const serializedSignature = bs58.encode(signature)

    await signIn('credentials', {
      message: JSON.stringify(message),
      redirect: false,
      signature: serializedSignature,
    })

    return true
  } catch (error) {
    console.log(error)
    throw error
  }
  return false
}
