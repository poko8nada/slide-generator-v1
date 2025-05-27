import { auth } from '@/auth'
import { createSlide, getSlidesByUser } from '@/lib/db/slides'
import { slideSchema } from '@/lib/validations/slide'
import type { ApiError, SlideListResponse } from '@/types/api'
// GET: スライド一覧取得, POST: 新規スライド作成
import { type NextRequest, NextResponse } from 'next/server'

// Cloudflare D1インスタンス取得（環境依存: ここは適宜修正）
declare const D1: D1Database

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>(
      { message: '認証が必要です', code: 401 },
      { status: 401 },
    )
  }
  const slides = await getSlidesByUser(D1, session.user.id)
  // imagesを配列に変換
  const slidesWithImages = slides.map(s => ({
    ...s,
    images: s.images ? JSON.parse(s.images) : null,
  }))
  return NextResponse.json<SlideListResponse>({ slides: slidesWithImages })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>(
      { message: '認証が必要です', code: 401 },
      { status: 401 },
    )
  }
  const body = await req.json()
  const parse = slideSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json<ApiError>(
      { message: parse.error.errors.map(e => e.message).join(','), code: 400 },
      { status: 400 },
    )
  }
  // 保存上限制御（10件）
  const slides = await getSlidesByUser(D1, session.user.id)
  if (slides.length >= 10) {
    return NextResponse.json<ApiError>(
      { message: '保存上限（10件）に達しています', code: 409 },
      { status: 409 },
    )
  }
  const slide = await createSlide(D1, session.user.id, parse.data)
  // imagesを配列に変換
  return NextResponse.json({
    ...slide,
    images: slide.images ? JSON.parse(slide.images) : null,
  })
}
