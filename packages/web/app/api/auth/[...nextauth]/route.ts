import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';

import { getNextAuthOptions } from '@/src/lib/auth';

async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req as any, res as any, getNextAuthOptions(req));
}

export { auth as POST, auth as GET };
