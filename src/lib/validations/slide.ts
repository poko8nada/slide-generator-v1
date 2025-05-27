// スライド作成・更新用Zodスキーマ
import { z } from 'zod'

export const slideSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  content: z
    .string()
    .min(1, '本文は必須です')
    .max(50000, '本文は50000文字以内で入力してください'),
  isPublic: z.boolean().optional().default(false),
  images: z
    .array(z.string().url('画像URLが不正です'))
    .max(20, '画像は20件までです')
    .optional(),
})

export type SlideInput = z.infer<typeof slideSchema>
