import { User, userSchema } from './user';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export interface Post {
  id: number;
  title: string;
  description: string;
  image_url: string;
  views: number;
  created_at: Date;
  user_id: number;
  on_chain: boolean;
  blocks?: string;
  proof_of_post?: string;
  arweave_url?: string;
  slug?: string;
  show__on_lp?: boolean;
}

export interface ArticleWithOwner extends Post {
  owner: User;
}

export interface Draft {
  id: number;
  title: string;
  description: string;
  image_url: string;
  source: string;
  created_at: Date;
  updated_at: Date;
  share_hash?: string;
  blocks?: string;
}

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  views: z.number(),
  created_at: z.date(),
  user_id: z.number(),
  on_chain: z.boolean(),
  blocks: z.string().optional(),
  proof_of_post: z.string().optional(),
  arweave_url: z.string().optional(),
  slug: z.string().optional(),
  show__on_lp: z.boolean().optional(),
});

export const postWithOwnerSchema = postSchema.extend({
  owner: userSchema,
});

export const draftSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  source: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  share_hash: z.string().optional(),
  blocks: z.string().optional(),
});

export const postRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation((opts) => {
      const { input } = opts;

      // [...]
    }),
  list: publicProcedure.query(() => {
    // ...
    return [];
  }),
});
