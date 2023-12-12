import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { TRPCError } from '@trpc/server'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { IronSession } from 'iron-session'
import { z } from 'zod'

import { db } from '@/src/db'
import { profiles, users } from '@/src/db/schema/user'
import { SessionData } from '@/src/lib/session'

import { isAuthorized } from '../middleware'
import { createTRPCRouter, publicProcedure } from '../trpc'

// users
export const insertUserSchema = createInsertSchema(users)

export const createUserSchema = insertUserSchema.omit({ id: true, joinTimestamp: true })

export const selectUserSchema = createSelectSchema(users)

// profiles
export const insertProfileSchema = createInsertSchema(profiles)

export const createProfileSchema = insertProfileSchema.omit({ id: true })

export const selectProfleSchema = createSelectSchema(profiles)

// routers
export const userRouter = createTRPCRouter({
  createUser: publicProcedure.input(createUserSchema).mutation(async (opts) => {
    const { input } = opts

    return await db.insert(users).values(input).returning()
  }),
  createProfile: publicProcedure
    .use(isAuthorized)
    .input(createProfileSchema)
    .mutation(async (opts) => {
      const { input, ctx } = opts

      if (!ctx) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return await db.insert(profiles).values(input).returning()
    }),
  getUsers: publicProcedure.query(async () => {
    return await db.query.users.findMany()
  }),
})

export const authRouter = createTRPCRouter({
  getSignInData: publicProcedure.query(async ({ ctx: { req } }) => {
    const now: Date = new Date()
    const uri = req.url
    const currentUrl = new URL(uri)
    const domain = currentUrl.host

    // Convert the Date object to a string
    const currentDateTime = now.toISOString()

    const signInData: SolanaSignInInput = {
      domain,
      statement:
        'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
      version: '1',
      nonce: 'oBbLoEldZs',
      chainId: 'mainnet',
      issuedAt: currentDateTime,
      resources: ['https://example.com', 'https://phantom.app/'],
    }

    return signInData
  }),
  verifySignIn: publicProcedure
    .input(
      z.object({
        payload: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { payload } = input
      const { session } = ctx

      try {
        const res = JSON.parse(payload)
        const { input, output } = res

        if (!input || !output) {
          throw new TRPCError({ code: 'BAD_REQUEST' })
        }

        const isValid = await verifySIWS(res.input, res.output)

        if (isValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        session.isLoggedIn = true
        session.publicKey = res.output.account.address
        await session.save()

        return session
      } catch (e) {
        return { isLoggedIn: false } as IronSession<SessionData>
      }
    }),
})

export const profileRouter = createTRPCRouter({
  getProfiles: publicProcedure.query(async () => {
    return await db.query.profiles.findMany()
  }),
})

function verifySIWS(input: SolanaSignInInput, output: SolanaSignInOutput): boolean {
  const serialisedOutput: SolanaSignInOutput = {
    account: {
      ...output.account,
      publicKey: new Uint8Array(Object.values(output.account.publicKey)),
    },
    signature: new Uint8Array(Buffer.from(output.signature)),
    signedMessage: new Uint8Array(Buffer.from(output.signedMessage)),
  }
  return verifySignIn(input, serialisedOutput)
}
