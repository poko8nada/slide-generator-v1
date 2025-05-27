// Drizzle ORMクライアント初期化（Cloudflare D1用）
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// Cloudflare D1の環境変数名例: process.env.DB_URL など
// 実際のD1接続方法はwranglerや環境により異なるため、ここでは型と初期化例のみ記載

export const getDrizzleClient = (d1: D1Database) => {
  return drizzle(d1, { schema })
}

// D1Database型はCloudflare Workers/Pages Functionsで提供される
// Next.js API Route等で利用する場合は、D1インスタンスの取得方法に注意
