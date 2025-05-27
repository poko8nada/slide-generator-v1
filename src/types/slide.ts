// スライド型定義

export type Slide = {
  id: string
  title: string
  content: string
  createdAt: string // ISO8601
  updatedAt: string // ISO8601
  userId: string
  images?: string[] // Cloudflare ImagesのURL
  isPublic: boolean
}
