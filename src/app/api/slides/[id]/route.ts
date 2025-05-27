// GET: スライド取得, PUT: スライド更新, DELETE: スライド削除
import { auth } from '@/auth'
import { deleteSlide, getSlideById, updateSlide } from '@/lib/db/slides'
import { slideSchema } from '@/lib/validations/slide'
import type { ApiError, SlideDetailResponse } from '@/types/api'
import { type NextRequest, NextResponse } from 'next/server'

// Cloudflare D1インスタンス取得（環境依存: ここは適宜修正）
declare const D1: D1Database

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>(
      { message: '認証が必要です', code: 401 },
      { status: 401 },
    )
  }
  const slide = await getSlideById(D1, session.user.id, params.id)
  if (!slide) {
    return NextResponse.json<ApiError>(
      { message: 'スライドが見つかりません', code: 404 },
      { status: 404 },
    )
  }
  return NextResponse.json<SlideDetailResponse>({
    slide: { ...slide, images: slide.images ? JSON.parse(slide.images) : null },
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
  // 所有者チェックも兼ねて更新
  const updated = await updateSlide(D1, session.user.id, params.id, parse.data)
  if (!updated) {
    return NextResponse.json<ApiError>(
      { message: 'スライドが見つかりません', code: 404 },
      { status: 404 },
    )
  }
  return NextResponse.json({
    ...updated,
    images: updated.images ? JSON.parse(updated.images) : null,
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>(
      { message: '認証が必要です', code: 401 },
      { status: 401 },
    )
  }
  // 所有者チェックも兼ねて削除
  const slide = await getSlideById(D1, session.user.id, params.id)
  if (!slide) {
    return NextResponse.json<ApiError>(
      { message: 'スライドが見つかりません', code: 404 },
      { status: 404 },
    )
  }
  await deleteSlide(D1, session.user.id, params.id)
  return NextResponse.json({ message: '削除しました' })
}
