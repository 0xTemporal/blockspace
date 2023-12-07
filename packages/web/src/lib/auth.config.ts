import { SignMessage, SigninMessage } from './signin-message'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import type { NextAuthConfig } from '@auth/nextjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { db } from '../db'

export const nextAuthConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          type: 'text',
        },
      },
      authorize: async ({ message, signature }) => {
        try {
          const signinMessage = new SigninMessage(JSON.parse((message as string) ?? '{}') as SignMessage)

          // TODO: fix this once problem is addressed - https://github.com/nextauthjs/next-auth/discussions/7256#discussioncomment-7308543
          const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0]

          if (signinMessage.nonce !== csrfToken) {
            return null
          }

          const validationResult = await signinMessage.validate((signature as string) ?? '')

          if (!validationResult) throw new Error('Could not validate the signed message')

          return {
            id: signinMessage.publicKey,
          }
        } catch (e) {
          console.log(e)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  secret: process.env.AUTH_SECRET,
  useSecureCookies: process.env.BASE_URL?.startsWith('https'),
  callbacks: {
    authorized: async ({ request, auth, expires }) => {
      return NextResponse.json({ ...auth })
    },
    session: async ({ session, token }) => {
      // @ts-ignore
      session.publicKey = token.sub
      if (session.user) {
        // TODO: update this to fetch from store - add proper name once user is onboarded
        session.user.name = token.sub
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`
      }
      return session
    },
  },
}
