import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'

import { appRouter } from '@/src/server/root'
import { createTRPCContext } from '@/src/server/trpc'

export const runtime = 'edge'

async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: process.env['BASE_URL'] + '/api/trpc',
    router: appRouter,
    req,
    createContext: createTRPCContext,
  })
}

export { handler as POST, handler as GET }
