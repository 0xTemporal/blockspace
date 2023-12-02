import { trpcServer } from '@hono/trpc-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { handle } from 'hono/vercel'

import { metascraper } from '@/src/lib/metascraper'
import { appRouter } from '@/src/server/app'

export const runtime = 'edge'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app
  .use('*', logger())
  .use('*', prettyJSON())
  // .use('/auth/*', jwt({ secret: process.env.AUTH_SECRET! }))
  // .get('/auth', (c) => {
  //   const payload = c.get('jwtPayload');

  //   console.log(payload);

  //   return c.json(payload);
  // })
  // .put('/upload/:key', async (c, next) => {
  //   const key = c.req.param('key');
  // })
  // .use(
  //   '/trpc/*',
  //   trpcServer({
  //     router: appRouter,
  //   }),
  // )
  // TODO: add OG image generation back
  .get('/hello', async (c) => {
    console.log(ms)
    return c.json({
      message: 'Hello Next.js!',
    })
  })

const handler = handle(app)

export { handler as GET, handler as POST }
