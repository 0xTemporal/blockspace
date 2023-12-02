import { createTRPCReact } from '@trpc/react-query'

import { AppRouter } from '@/src/server/app'

export const trpc = createTRPCReact<AppRouter>()
