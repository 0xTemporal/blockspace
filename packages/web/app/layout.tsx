import './globals.css'
import { BaseProvider, PostHogPageview } from './providers'
import '@solana/wallet-adapter-react-ui/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

import { NavBar } from '@/src/components/nav-bar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <BaseProvider>
          <NavBar />
          <main className="mb-20">{children}</main>
        </BaseProvider>
      </body>
    </html>
  )
}
