'use server'
import { db, slides } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import type { Session } from 'next-auth'
import { unstable_cache } from 'next/cache'

export type Slide = typeof slides.$inferSelect

// export async function getSlides(session: Session | null): Promise<Slide[]> {
//   console.log('[getSlides] session:', session)
//   if (!session?.user?.id) {
//     console.log('[getSlides] session.user.id is missing')
//     return []
//   }
//   try {
//     console.log('[getSlides] userId:', session.user.id)
//     const result = await db
//       .select()
//       .from(slides)
//       .where(eq(slides.userId, session.user.id))
//     console.log('[getSlides] db result:', result)
//     return result
//   } catch (e) {
//     console.log('[getSlides] error:', e)
//     return []
//   }
// }

export const getSlides = unstable_cache(
  async (session: Session | null): Promise<Slide[]> => {
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
        .orderBy(desc(slides.updatedAt))
      console.log('[getSlides] db result:', result)
      return result
    } catch (e) {
      console.log('[getSlides] error:', e)
      return []
    }
  },
  ['slides'],
  {
    tags: ['slides'],
  },
)

export async function updateSlide(
  id: string,
  body: string,
  session: Session | null,
) {
  if (!session?.user?.id) {
    console.log('[updateSlide] session.user.id is missing')
    return
  }
  try {
    await db
      .update(slides)
      .set({ body })
      .where(eq(slides.id, String(id)))
  } catch (e) {
    console.log('[updateSlide] error:', e)
  }
}
