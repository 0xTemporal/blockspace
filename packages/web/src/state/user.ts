import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  publicKey: string;
  twitterHandle: string;
}

interface UserState {
  user?: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        name: 'toly',
        bio: 'Wartime OSS maintainer. Co-founder of Solana Labs. Follows, retweets, likes are not endorsements. NFA, mostly technical gibberish. Be kind! toly@sollinked.com',
        avatar: 'https://pbs.twimg.com/profile_images/1725588229808889859/L6bOXam6_400x400.jpg',
        twitterHandle: 'aeyakovenko',
        publicKey: 'toly.sol',
      } as User,
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'blockspace-user', // unique name
    },
  ),
);
