import { httpBatchLink } from '@trpc/client'

import { appRouter } from '@/src/server/app'

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: process.env.BASE_URL + '/api/trpc',
    }),
  ],
})
