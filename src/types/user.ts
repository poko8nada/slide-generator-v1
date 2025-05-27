// ユーザー型定義

export type User = {
  id: string
  name: string
  email: string
  image?: string
  createdAt: string // ISO8601
  updatedAt: string // ISO8601
  isAdmin?: boolean
}
