import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

import { db } from '@/src/db'
import { articles } from '@/src/db/schema/article'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const insertArticleSchema = createInsertSchema(articles)

export const createArticleSchema = insertArticleSchema.omit({ id: true, creationTimestamp: true })

export const selectArticleSchema = createSelectSchema(articles)

export const articleRouter = createTRPCRouter({
  createArticle: publicProcedure.input(createArticleSchema).mutation(async (opts) => {
    const { input } = opts
    return await db.insert(articles).values(input).returning()
  }),
  getArticles: publicProcedure.query(async () => {
    return await db.query.articles.findMany()
  }),
  getArticleById: publicProcedure.input(selectArticleSchema).query(async ({ input }) => {
    return await db.query.articles.findFirst({ where: (fields, { eq }) => eq(fields.id, input.id) })
  }),
})
