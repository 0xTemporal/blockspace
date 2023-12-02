import { z } from 'zod'

export const mintApiRequestSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  description: z.string().optional(),
  owner: z.string(),
  delegate: z.string().optional(),
  collection: z.string().optional(),
  creators: z
    .array(
      z.object({
        address: z.string(),
        share: z.number(),
      }),
    )
    .optional(),
  uri: z.string().optional(),
  sellerFeeBasisPoints: z.number().optional(),
  imageUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  imagePath: z.string().optional(),
  walletPrivateKey: z.string().optional(),
})
