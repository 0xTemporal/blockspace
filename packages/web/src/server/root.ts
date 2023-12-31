import { articleRouter } from './routers/article'
import { authRouter, userRouter } from './routers/user'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  articles: articleRouter,
  auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
