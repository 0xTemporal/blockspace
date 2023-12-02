import { router } from '.'
import { articleRouter } from './routers/article'
import { userRouter } from './routers/user'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

import { auth } from '../lib/auth'

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await auth()

  return {
    session,
    req,
    res,
  }
}

export const appRouter = router({
  user: userRouter,
  article: articleRouter,
})

export type Context = Awaited<ReturnType<typeof createContext>>
export type AppRouter = typeof appRouter
