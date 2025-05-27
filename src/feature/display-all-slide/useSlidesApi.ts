// スライドAPI呼び出し用hooks/util

import type { Slide, SlideCreateRequest, SlideUpdateRequest } from '@/types/api'

import type { SlideDetailResponse, SlideListResponse } from '@/types/api'

export async function fetchSlides(): Promise<Slide[]> {
  const res = await fetch('/api/slides')
  if (!res.ok) throw new Error('スライド一覧取得に失敗しました')
  const data = (await res.json()) as SlideListResponse
  return data.slides
}

export async function fetchSlide(id: string): Promise<Slide> {
  const res = await fetch(`/api/slides/${id}`)
  if (!res.ok) throw new Error('スライド取得に失敗しました')
  const data = (await res.json()) as SlideDetailResponse
  return data.slide
}

export async function createSlide(input: SlideCreateRequest): Promise<Slide> {
  const res = await fetch('/api/slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('スライド作成に失敗しました')
  return await res.json()
}

export async function updateSlide(
  id: string,
  input: SlideUpdateRequest,
): Promise<Slide> {
  const res = await fetch(`/api/slides/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('スライド更新に失敗しました')
  return await res.json()
}

export async function deleteSlide(id: string): Promise<void> {
  const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('スライド削除に失敗しました')
}
