// スライドAPI用型定義

import type { SlideInput } from '@/lib/validations/slide'

export type Slide = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  images: string[] | null
  isPublic: boolean
}

export type SlideListResponse = {
  slides: Slide[]
}

export type SlideDetailResponse = {
  slide: Slide
}

export type SlideCreateRequest = SlideInput
export type SlideUpdateRequest = SlideInput

export type ApiError = {
  message: string
  code?: string | number
}
