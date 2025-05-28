import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
// Drizzle ORM: usersテーブルスキーマ＋DBインスタンス
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// usersテーブル: auth.js公式・drizzle公式準拠
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // auth.js: string
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
})

// D1 DBインスタンス生成（Cloudflare D1用）
export function getDb(database: D1Database) {
  return drizzle(database)
}
