import { middleware } from './trpc'
import { TRPCError } from '@trpc/server'

export const isAuthed = middleware(({ ctx, next }) => {
  const { session } = ctx
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx,
  })
})
