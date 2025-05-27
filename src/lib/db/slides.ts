import { getDrizzleClient } from '@/config/db/client'
import { slides } from '@/config/db/schema'
import type { SlideInput } from '@/lib/validations/slide'
// スライドDB操作関数（Drizzle ORM用）
import { and, eq } from 'drizzle-orm'

// 一覧取得（ユーザーごと）
export async function getSlidesByUser(d1: D1Database, userId: string) {
  const db = getDrizzleClient(d1)
  return db.select().from(slides).where(eq(slides.userId, userId))
}

// 作成
export async function createSlide(
  d1: D1Database,
  userId: string,
  input: SlideInput,
) {
  const db = getDrizzleClient(d1)
  const now = new Date().toISOString()
  const slide = {
    id: crypto.randomUUID(),
    title: input.title,
    content: input.content,
    createdAt: now,
    updatedAt: now,
    userId,
    images: input.images ? JSON.stringify(input.images) : null,
    isPublic: input.isPublic ?? false,
  }
  await db.insert(slides).values(slide)
  return slide
}

// 取得
export async function getSlideById(
  d1: D1Database,
  userId: string,
  slideId: string,
) {
  const db = getDrizzleClient(d1)
  return db.query.slides.findFirst({
    where: (s, { and, eq }) => and(eq(s.id, slideId), eq(s.userId, userId)),
  })
}

// 更新
export async function updateSlide(
  d1: D1Database,
  userId: string,
  slideId: string,
  input: SlideInput,
) {
  const db = getDrizzleClient(d1)
  const now = new Date().toISOString()
  await db
    .update(slides)
    .set({
      title: input.title,
      content: input.content,
      updatedAt: now,
      images: input.images ? JSON.stringify(input.images) : null,
      isPublic: input.isPublic ?? false,
    })
    .where(
      // 複数条件はand()でまとめる
      and(eq(slides.id, slideId), eq(slides.userId, userId)),
    )
  return getSlideById(d1, userId, slideId)
}

// 削除
export async function deleteSlide(
  d1: D1Database,
  userId: string,
  slideId: string,
) {
  const db = getDrizzleClient(d1)
  await db
    .delete(slides)
    .where(and(eq(slides.id, slideId), eq(slides.userId, userId)))
}
