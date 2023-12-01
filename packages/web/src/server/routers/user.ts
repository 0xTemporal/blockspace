import * as anchor from '@coral-xyz/anchor';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export interface User {
  id: number;
  name: string;
  username: string;
  public_key: string;
  blog_name: string;
  tip_enabled: boolean;
  connection_count?: number;
  profile_hash?: string;
  bio?: string;
  twitter?: string;
  discord?: string;
  image_url?: string;
  banner_url?: string;
  invited_by: { name: string; username: string } | null;
}

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  public_key: z.string(),
  blog_name: z.string(),
  tip_enabled: z.boolean(),
  connection_count: z.number().optional(),
  profile_hash: z.string().optional(),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  discord: z.string().optional(),
  image_url: z.string().optional(),
  banner_url: z.string().optional(),
  invited_by: z
    .object({
      name: z.string(),
      username: z.string(),
    })
    .nullable(),
});

export const userRouter = router({
  create: publicProcedure.input(userSchema).mutation((opts) => {
    const { input } = opts;

    //   const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
    // const profileHash = randombytes(32);
    // const profileSeeds = [Buffer.from("profile"), profileHash];
    // const [profileKey] = await anchor.web3.PublicKey.findProgramAddress(
    //   profileSeeds,
    //   program.programId
    // );
    // const transaction = await program.methods.initialize(profileHash).accounts({
    //   profile: profileKey,
    //   user: wallet.publicKey,
    //   systemProgram: SystemProgram.programId
    // }).transaction();
    // const confirmed = await sendAndConfirmTransaction(
    //   connection,
    //   transaction,
    //   wallet
    // );
    // if (!confirmed) return;
    // return profileHash.toString('base64');
  }),
  list: publicProcedure.query(() => {
    // [..]
    return [] as number[];
  }),
});
