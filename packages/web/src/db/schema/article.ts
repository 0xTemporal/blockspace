import { users } from './user'
import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  views: integer('views'),
  createdOn: integer('created_on', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  userId: integer('user_id').references(() => users.id),
  onchain: integer('on_chain', { mode: 'boolean' }),
  verification: text('verification'),
  arweaveUrl: text('arweave_url'),
  slug: text('slug'),
})

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, { fields: [articles.userId], references: [users.id] }),
}))

export const reactions = sqliteTable('reactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content'),
  userId: integer('user_id').references(() => users.id),
  articleId: integer('article_id').references(() => articles.id),
})

export const reactionsRelations = relations(reactions, ({ one }) => ({
  article: one(articles, {
    fields: [reactions.articleId],
    references: [articles.id],
  }),
}))
