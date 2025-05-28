import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth'
import Google from 'next-auth/providers/google'

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
