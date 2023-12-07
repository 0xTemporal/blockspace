import { AppRouter } from './server/root'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
  transformer: superjson,
})
