'use server'
import { db, slides } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import type { Session } from 'next-auth'
import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

export type Slide = typeof slides.$inferSelect

export const getSlides = unstable_cache(
  async (session: Session | null): Promise<Slide[]> => {
    if (!session?.user?.id) {
      console.log('[getSlides] session.user.id is missing')
      return []
    }
    try {
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
    throw new Error('ユーザー情報がありません（未ログイン）')
  }
  try {
    await db
      .update(slides)
      .set({ body, updatedAt: new Date() })
      .where(eq(slides.id, String(id)))
    revalidateTag('slides')
  } catch (e) {
    console.log('[updateSlide] error:', e)
    throw e instanceof Error ? e : new Error('スライド保存に失敗しました')
  }
}
