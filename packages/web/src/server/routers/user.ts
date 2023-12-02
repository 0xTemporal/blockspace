import { TRPCError } from '@trpc/server'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

import { db } from '@/src/db'
import { profiles, users } from '@/src/db/schema/user'

import { isAuthed } from '../middleware'
import { publicProcedure, router } from '../trpc'

// users

export const insertUserSchema = createInsertSchema(users)

export const createUserSchema = insertUserSchema.omit({ id: true, joinTimestamp: true })

export const selectUserSchema = createSelectSchema(users)

// profiles

export const insertProfileSchema = createInsertSchema(profiles)

export const createProfileSchema = insertProfileSchema.omit({ id: true })

export const selectProfleSchema = createSelectSchema(profiles)

// trpc router

export const userRouter = router({
  createUser: publicProcedure.input(createUserSchema).mutation(async (opts) => {
    const { input } = opts

    return await db.insert(users).values(input).returning()
  }),
  createProfile: publicProcedure
    .use(isAuthed)
    .input(createProfileSchema)
    .mutation(async (opts) => {
      const { input, ctx } = opts

      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return await db.insert(profiles).values(input).returning()
    }),
  getUsers: publicProcedure.query(async () => {
    return await db.query.users.findMany()
  }),
})
