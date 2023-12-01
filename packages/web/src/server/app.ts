import { router } from '.';
import { postRouter } from './routers/post';
import { userRouter } from './routers/user';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';

import { getNextAuthOptions } from '../lib/auth';

export const createContext = async ({ req, res, ...rest }: CreateNextContextOptions) => {
  const session = await getServerSession(req, res, getNextAuthOptions(req));

  console.log(rest);
  // const db = drizzle(env.Bindings?.DB);

  return {
    session,
    req,
    res,
  };
};

export const appRouter = router({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
