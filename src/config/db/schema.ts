// Drizzle ORM schema for slides and users
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image'),
  createdAt: text('created_at').notNull(), // ISO8601
  updatedAt: text('updated_at').notNull(), // ISO8601
  isAdmin: integer('is_admin', { mode: 'boolean' }),
})

export const slides = sqliteTable('slides', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(), // ISO8601
  updatedAt: text('updated_at').notNull(), // ISO8601
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  images: text('images'), // JSON文字列 or カンマ区切り
  isPublic: integer('is_public', { mode: 'boolean' }).notNull(),
})
