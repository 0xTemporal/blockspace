import { articles } from './article'
import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  publicKey: text('public_key').unique().notNull(),
  joinedOn: text('joined_on').default(sql`CURRENT_TIMESTAMP`),
  invitedBy: integer('invited_by'),
})

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  articles: many(articles),
  invitee: one(users, { fields: [users.invitedBy], references: [users.id] }),
}))

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  username: text('user'),
  avatar: text('avatar'),
  slug: text('slug'),
  bio: text('bio'),
  twitterHandle: text('twitter_handle'),
  userId: integer('user_id').references(() => users.id),
  tipEnabled: integer('tip_enabled', { mode: 'boolean' }).default(false),
})

export const sessions = sqliteTable('session', {
  sessionToken: text('session_token').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})
