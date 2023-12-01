import { createNextApiHandler } from '@trpc/server/adapters/next';

import { AppRouter, appRouter, createContext } from '@/src/server/app';

const nextApiHandler = createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
  batching: { enabled: true },
});

export { nextApiHandler as GET, nextApiHandler as POST };
