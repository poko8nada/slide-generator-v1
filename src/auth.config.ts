import { DrizzleAdapter } from '@auth/drizzle-adapter'
import type { D1Database } from '@cloudflare/workers-types'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth'
import Google from 'next-auth/providers/google'
import { getDb, users } from './lib/d1-user'

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

// DrizzleAdapter生成関数（D1Databaseを引数で受け取る）
export function getDrizzleAdapter(database: D1Database) {
  const db = getDb(database)
  return DrizzleAdapter(db, { usersTable: users })
}
