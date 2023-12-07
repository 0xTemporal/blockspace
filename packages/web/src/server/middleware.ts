import { middleware } from './trpc'
import { TRPCError } from '@trpc/server'

export const isAuthorized = middleware(async (opts) => {
  const { ctx } = opts

  if (!ctx.session.isLoggedIn) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return await opts.next()
})
