'use client'

import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps'
import { SNSIdentityResolver } from '@dialectlabs/identity-sns'
import {
  DialectSolanaSdk,
  DialectSolanaWalletAdapter,
  SolanaConfigProps,
} from '@dialectlabs/react-sdk-blockchain-solana'
import { DialectNoBlockchainSdk, DialectThemeProvider, DialectUiManagementProvider } from '@dialectlabs/react-ui'
import { NextUIProvider } from '@nextui-org/react'
import { Adapter } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { SolanaSignInInput } from '@solana/wallet-standard-features'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Toaster } from '@/src/components/toaster'
import { solanaWalletToDialectWallet } from '@/src/lib/dialect'

const DialectProvider = ({ children }: { children: React.ReactNode }) => {
  const solanaWallet = useWallet()
  const connection = useConnection()
  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] = useState<DialectSolanaWalletAdapter | null>(null)

  // Basic Dialect-related configuration
  const dialectConfig = useMemo(
    () => ({
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      identity: {
        resolvers: [new DialectDappsIdentityResolver(), new SNSIdentityResolver(connection)],
      },
    }),
    [connection],
  )

  const solanaConfig: SolanaConfigProps = useMemo(
    () => ({
      wallet: dialectSolanaWalletAdapter,
    }),
    [dialectSolanaWalletAdapter],
  )

  useEffect(() => {
    setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(solanaWallet))
  }, [solanaWallet])

  if (dialectSolanaWalletAdapter) {
    return (
      <DialectSolanaSdk config={dialectConfig} solanaConfig={solanaConfig}>
        {children}
      </DialectSolanaSdk>
    )
  }
  return <DialectNoBlockchainSdk>{children}</DialectNoBlockchainSdk>
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export const BaseProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const wallets = useMemo(() => [], [])

  const autoSignIn = useCallback(async (adapter: Adapter) => {
    // If the signIn feature is not available, return true
    if (!('signIn' in adapter)) return true

    // Fetch the signInInput from the backend
    const createResponse = await fetch('/api/auth')

    const input: SolanaSignInInput = await createResponse.json()

    // Send the signInInput to the wallet and trigger a sign-in request
    const output = await adapter.signIn(input)

    // Verify the sign-in output against the generated input server-side
    let strPayload = JSON.stringify({ input, output })
    const verifyResponse = await fetch('/api/auth', {
      method: 'POST',
      body: strPayload,
    })
    const success = await verifyResponse.json()

    // If verification fails, throw an error
    if (!success) throw new Error('Sign In verification failed!')

    return false
  }, [])

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <PHProvider>
          <ConnectionProvider endpoint={`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`}>
            <WalletProvider wallets={wallets} autoConnect={autoSignIn}>
              <DialectProvider>
                <DialectThemeProvider>
                  <DialectUiManagementProvider>
                    <WalletModalProvider>
                      <Toaster />
                      {children}
                    </WalletModalProvider>
                  </DialectUiManagementProvider>
                </DialectThemeProvider>
              </DialectProvider>
            </WalletProvider>
          </ConnectionProvider>
        </PHProvider>
      </ThemeProvider>
    </NextUIProvider>
  )
}
