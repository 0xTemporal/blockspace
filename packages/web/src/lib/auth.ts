import { SigninMessage } from './signin-message';
import { NextApiRequest } from 'next';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';

export const getNextAuthOptions = (req: NextApiRequest) => {
  const providers = [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          type: 'text',
        },
      },
      async authorize(credentials, req) {
        try {
          const signinMessage = new SigninMessage(JSON.parse(credentials?.message || '{}'));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? '');
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(credentials?.signature || '');

          if (!validationResult) throw new Error('Could not validate the signed message');

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  if (req.method === 'GET' && req.query?.nextauth?.includes('signin')) {
    providers.pop();
  }

  return {
    providers,
    session: {
      strategy: 'jwt',
      maxAge: 15 * 24 * 30 * 60, // 15 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    useSecureCookies: process.env.NEXTAUTH_URL?.startsWith('https'),
    callbacks: {
      session: async ({ session, token }) => {
        // @ts-ignore
        session.publicKey = token.sub;
        if (session.user) {
          // TODO: update this to fetch from store - add proper name once user is onboarded
          session.user.name = token.sub;
          session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
        }
        return session;
      },
    },
  } as NextAuthOptions;
};
