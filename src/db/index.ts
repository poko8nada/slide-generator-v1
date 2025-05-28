import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'

/**
 * Cloudflare D1公式推奨: リクエストごとにdrizzleインスタンス生成
 */
export function getDrizzle(env: { D1: D1Database }) {
  return drizzle(env.D1)
}
