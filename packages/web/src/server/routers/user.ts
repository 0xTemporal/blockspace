import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { TRPCError } from '@trpc/server'
import bs58 from 'bs58'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import nacl from 'tweetnacl'
import { decodeUTF8, encodeUTF8 } from 'tweetnacl-util'
import { z } from 'zod'

import { db } from '@/src/db'
import { profiles, users } from '@/src/db/schema/user'

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
        const signatureUint8 = bs58.decode(res.output.signature)
        // const msgUint8 = new TextEncoder().encode(res.output.signedMessage.toString())
        // const pubKeyUint8 = bs58.decode(res.output.account.publicKey)

        // const isValid = nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8)
        // const isValid = verifySignIn(res.input, res.output)
        const isValid = true
        console.log(isValid)

        if (!isValid) {
          return Response.json({ error: 'Invalid signature' }, { status: 401 })
        }

        session.isLoggedIn = true
        session.publicKey = res.output.account.address
        await session.save()

        return Response.json({ isValid, session })
      } catch (e) {
        console.log('error', e)

        // return Response.json({ error: 'Invalid signature' }, { status: 401 })
      }

      return

      try {
        const response = await fetch('http://localhost:3000/api/auth', {
          method: 'POST',
          body: payload,
        })

        return await response.json()
      } catch (error) {
        console.error(error)
      }
    }),
})

function verifySIWS(input: SolanaSignInInput, output: SolanaSignInOutput): boolean {
  const serialisedOutput: SolanaSignInOutput = {
    account: {
      ...output.account,
      publicKey: new Uint8Array(Buffer.from(output.account.publicKey.toString())),
    },
    signature: new Uint8Array(Buffer.from(output.signature.toString())),
    signedMessage: new Uint8Array(Buffer.from(output.signedMessage.toString())),
  }
  return verifySignIn(input, serialisedOutput)
}
