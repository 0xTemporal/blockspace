import { NextAuth } from '@auth/nextjs'

import { nextAuthConfig } from './auth.config'

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(nextAuthConfig)
