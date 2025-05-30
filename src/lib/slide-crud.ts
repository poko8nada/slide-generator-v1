'use server'
import { db, slides } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { Session } from 'next-auth'

export type Slide = typeof slides.$inferSelect

export async function getSlides(session: Session | null): Promise<Slide[]> {
  console.log('[getSlides] session:', session)
  if (!session?.user?.id) {
    console.log('[getSlides] session.user.id is missing')
    return []
  }
  try {
    console.log('[getSlides] userId:', session.user.id)
    const result = await db
      .select()
      .from(slides)
      .where(eq(slides.userId, session.user.id))
    console.log('[getSlides] db result:', result)
    return result
  } catch (e) {
    console.log('[getSlides] error:', e)
    return []
  }
}
