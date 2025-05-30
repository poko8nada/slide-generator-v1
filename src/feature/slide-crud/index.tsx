// スライド一覧取得（Read）関数のみ実装
import { db } from '@/db/schema'
import { slides } from '@/db/schema'

// スライド型
export type Slide = typeof slides.$inferSelect

// スライド一覧取得
export async function getSlides(): Promise<Slide[]> {
  try {
    // 全件取得（必要に応じてorderBy等追加可）
    const result = await db.select().from(slides)
    return result
  } catch (e) {
    throw new Error('Failed to fetch slides')
  }
}
