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
      // console.log('[getSlides] db result:', result)
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

function createTitleByBody(body: string): string {
  const trimmedBody = body.trim()
  if (!trimmedBody) return 'Untitled'

  const firstSlide = trimmedBody.split(/(?<=\n|^)---(?=\n|$)/)[0]
  // Markdown記法の記号を取り除く
  const cleanText = firstSlide
    .replace(/^#+\s*/, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/__(.*?)__/g, '$1') // Remove bold (underscore)
    .replace(/_(.*?)_/g, '$1') // Remove italic (underscore)
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links [text](url)
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Remove images ![alt](url)
    .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
    .replace(/^\s*[-*+]\s+/gm, '') // Remove unordered list markers (-, *, +)
    .replace(/^\s*\d+\.\s+/gm, '') // Remove ordered list markers (1. 2. 3.)
    .replace(/^\s*>\s?/gm, '') // Remove blockquotes
    .replace(/^\s*\|.*\|\s*$/gm, '') // Remove table pipes and headers
    .replace(/^\s*\|?[-: ]+\|?\s*$/gm, '') // Remove table separator lines (|---|)
    .replace(/<[^>]+>/g, '') // Remove HTML tags (for images, links, etc.)
    .replace(/\s+/g, ' ') // Collapse multiple spaces/newlines
    .trim()

  return cleanText.length > 30
    ? `${cleanText.slice(0, 30)}...`
    : cleanText || 'Untitled'
}

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
    const title = createTitleByBody(body)
    await db
      .update(slides)
      .set({ title, body, updatedAt: new Date() })
      .where(eq(slides.id, String(id)))
    revalidateTag('slides')
  } catch (e) {
    console.log('[updateSlide] error:', e)
    throw e instanceof Error ? e : new Error('スライド保存に失敗しました')
  }
}

export async function createSlide(
  session: Session | null,
  title = 'New slide',
) {
  if (!session?.user?.id) {
    console.log('[createSlide] session.user.id is missing')
    return []
  }
  try {
    console.log(
      '[createSlide] Creating slide for user:',
      session.user.id,
      'with title:',
      title,
    )
    await db.insert(slides).values({
      userId: session.user.id,
      title,
      body: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('[createSlide] Slide created successfully')
  } catch (e) {
    console.log('[createSlide] error:', e)
    throw e instanceof Error ? e : new Error('スライド作成に失敗しました')
  }
}
