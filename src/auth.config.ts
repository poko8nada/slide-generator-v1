import { getDrizzle } from '@/db'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth'
import Google from 'next-auth/providers/google'

// Cloudflare D1 Database取得（グローバルスコープで1インスタンスのみ生成）
const db =
  typeof globalThis !== 'undefined' && 'D1' in globalThis
    ? getDrizzle(globalThis as unknown as { D1: D1Database })
    : undefined

// Session を拡張
declare module 'next-auth' {
  interface Session {
    idToken: string
  }
}

// JWT を拡張
declare module 'next-auth' {
  interface JWT {
    idToken: string
  }
}

export default {
  providers: [Google],
  adapter: db ? DrizzleAdapter(db) : undefined,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.id_token) {
        token.idToken = account?.id_token
      }
      return token
    },
    async session({ token, session }) {
      session.idToken = (token as unknown as JWT).idToken
      return session
    },
  },
} satisfies NextAuthConfig
