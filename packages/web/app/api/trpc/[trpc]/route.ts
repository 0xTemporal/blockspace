import { createNextApiHandler } from '@trpc/server/adapters/next'

import { AppRouter, appRouter, createContext } from '@/src/server/app'

export const runtime = 'edge'

const nextApiHandler = createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
})

export { nextApiHandler as GET, nextApiHandler as POST }
