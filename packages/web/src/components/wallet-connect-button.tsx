'use client'

import { Button, ButtonProps } from '@nextui-org/react'
import { useWalletConnectButton } from '@solana/wallet-adapter-base-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletIcon, useWalletModal } from '@solana/wallet-adapter-react-ui'
import { SolanaSignInOutput } from '@solana/wallet-standard-features'
import { useCallback, useEffect, useState } from 'react'

import { client } from '../api'

import { set } from '@coral-xyz/anchor/dist/cjs/utils/features'

import { useUserStore } from '../state/user'

// import { signInWithSolana } from '../lib/siws'

export const WalletConnectButton = (props: ButtonProps) => {
  const { setVisible } = useWalletModal()
  const { walletIcon, walletName } = useWalletConnectButton()
  const { publicKey, signMessage, connect, signIn } = useWallet()
  const [connecting, setConnecting] = useState(false)
  const { setSession } = useUserStore()

  useEffect(() => {
    if (walletName !== undefined) {
      connect()
    }
  }, [connect, walletName])

  const handleSignIn = useCallback(async () => {
    setConnecting(true)
    try {
      const input = await client.auth.getSignInData.query()

      const output = await signIn?.(input)

      const serialized: SolanaSignInOutput = {
        account: {
          address: output?.account.address!,
          publicKey: output?.account.publicKey!,
          chains: output?.account.chains!,
          features: output?.account.features!,
        },
        signature: output?.signature!,
        signedMessage: output?.signedMessage!,
        signatureType: output?.signatureType,
      }

      const payload = JSON.stringify({ input, output: serialized })

      const response = await client.auth.verifySignIn.mutate({ payload })

      setSession(response)
    } catch (e) {
      console.log(e)
    } finally {
      setConnecting(false)
    }
    // signInWithSolana(publicKey!, signMessage!)
  }, [publicKey, signMessage])

  return walletName === undefined ? (
    <Button
      color="primary"
      {...props}
      onClick={() => {
        setVisible(true)
      }}
    >
      Select Wallet
    </Button>
  ) : (
    <Button {...props} onClick={handleSignIn} color="primary" isLoading={connecting}>
      {walletIcon && walletName && !connecting ? (
        <span className="h-6 w-6">
          <WalletIcon wallet={{ adapter: { icon: walletIcon, name: walletName } }} />
        </span>
      ) : undefined}
      {connecting ? 'Connecting' : 'Connect'}
    </Button>
  )
}
