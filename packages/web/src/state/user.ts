import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Session } from '../lib/session'

interface User {
  name: string
  avatar: string
  bio: string
  joinedDate: string
  publicKey: string
  twitterHandle: string
}

interface UserState {
  user?: User
  setUser: (user: User) => void
  session?: Session
  setSession: (session?: Session) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        name: 'toly',
        bio: 'Wartime OSS maintainer. Co-founder of Solana Labs. Follows, retweets, likes are not endorsements. NFA, mostly technical gibberish. Be kind! toly@sollinked.com',
        twitterHandle: 'aeyakovenko',
        publicKey: 'toly.sol',
      } as User,
      setUser: (user: User) => set({ user }),
      session: { isLoggedIn: false } as Session,
      setSession: (session?: Session) => set({ session }),
    }),
    {
      name: 'blockspace-user', // unique name
    },
  ),
)
