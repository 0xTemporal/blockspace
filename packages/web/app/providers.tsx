'use client';

import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import { SNSIdentityResolver } from '@dialectlabs/identity-sns';
import {
  DialectSolanaSdk,
  DialectSolanaWalletAdapter,
  SolanaConfigProps,
} from '@dialectlabs/react-sdk-blockchain-solana';
import { DialectNoBlockchainSdk, DialectThemeProvider, DialectUiManagementProvider } from '@dialectlabs/react-ui';
import { NextUIProvider } from '@nextui-org/react';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Toaster } from '@/src/components/toaster';
import { solanaWalletToDialectWallet } from '@/src/lib/dialect';

const DialectProvider = ({ children }: { children: React.ReactNode }) => {
  const solanaWallet = useWallet();
  const connection = useConnection();
  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] = useState<DialectSolanaWalletAdapter | null>(null);

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
  );

  const solanaConfig: SolanaConfigProps = useMemo(
    () => ({
      wallet: dialectSolanaWalletAdapter,
    }),
    [dialectSolanaWalletAdapter],
  );

  useEffect(() => {
    setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(solanaWallet));
  }, [solanaWallet]);

  if (dialectSolanaWalletAdapter) {
    return (
      <DialectSolanaSdk config={dialectConfig} solanaConfig={solanaConfig}>
        {children}
      </DialectSolanaSdk>
    );
  }
  return <DialectNoBlockchainSdk>{children}</DialectNoBlockchainSdk>;
};

export const BaseProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], []);

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ConnectionProvider endpoint={`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`}>
          <WalletProvider wallets={wallets}>
            <SessionProvider>
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
            </SessionProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
};
