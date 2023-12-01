// re-add when ready to spin rpc out
import { trpcServer } from '@hono/trpc-server';
import { zValidator } from '@hono/zod-validator';
import { Env, Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { handle } from 'hono/vercel';

import { appRouter, createContext } from '@/src/server/app';

export const runtime = 'edge';

const app = new Hono<{}>().basePath('/api');

app
  .use('*', logger())
  .use('*', prettyJSON())
  .put('/upload/:key', async (c, next) => {
    const key = c.req.param('key');
  })
  .use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
      createContext,
    }),
  )
  // TODO: add OG image generation back
  .get('/hello', (c) => {
    return c.json({
      message: 'Hello Next.js!',
    });
  });

const handler = handle(app);

export { handler as GET, handler as POST };
