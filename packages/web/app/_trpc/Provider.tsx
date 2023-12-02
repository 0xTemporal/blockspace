'use client'

import { trpc } from './client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { unstable_httpBatchStreamLink as httpBatchStreamLink, loggerLink } from '@trpc/client'
import React, { useState } from 'react'
import superjson from 'superjson'

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchStreamLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
      transformer: superjson,
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
