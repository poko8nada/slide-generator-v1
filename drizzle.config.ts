// drizzle-kit config for Cloudflare D1
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/d1-user.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: 'YOUR_ACCOUNT_ID', // Cloudflareダッシュボードから取得
    databaseId: '80d086ea-2700-49c0-bb84-5c0657aebf28',
    token: 'YOUR_API_TOKEN', // Cloudflare APIトークン
  },
} satisfies Config
