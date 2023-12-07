import { SessionOptions, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: 'blockspace-session',
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === 'production',
  },
}

export interface SessionData {
  publicKey?: string
  isLoggedIn: boolean
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
}

export const getSession = async () => await getIronSession<SessionData>(cookies(), sessionOptions)
