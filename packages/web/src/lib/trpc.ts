import { unstable_httpBatchStreamLink as httpBatchStreamLink, httpLink, loggerLink, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

import { AppRouter } from '../server/app';

const URL = '/api/trpc';

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    links: [
      loggerLink({
        enabled: (opts) =>
          (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      splitLink({
        condition({ context }) {
          return context.skipBatch === true;
        },
        true: httpLink({
          url: URL,
        }),
        false: httpBatchStreamLink({
          url: URL,
        }),
      }),
    ],
    transformer: superjson,
    abortOnUnmount: true,
  }),
  ssr: true,
  responseMeta: (opts) => {
    const { clientErrors } = opts;
    if (clientErrors.length) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0]?.data?.httpStatus ?? 500,
      };
    }
    // cache request for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      headers: {
        'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    };
  },
});
