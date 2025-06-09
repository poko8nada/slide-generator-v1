'use client'
import { Label } from '@/components/ui/label'
import type { Slide } from '@/lib/slide-crud'
import { useMdData } from '@/providers/md-data-provider'
import { confirmUnsaved } from '@/lib/unsaved-warning'

import { useState } from 'react'
import { deleteSlide as deleteSlideServer } from '@/lib/slide-crud'

export default function CustomSlideItem({ slide }: { slide: Slide }) {
  const [isDeleting, setIsDeleting] = useState(false)
  if (!slide) return null

  const { updateMdData, isDiff, mdData } = useMdData()
  const { id, title, updatedAt } = slide

  // UI即時反映用: 親リストでfilterする設計が理想だが、ここでは簡易的にreload
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('本当に削除しますか？')) return
    setIsDeleting(true)
    try {
      await deleteSlideServer(id, null)
      // 選択中なら解除
      if (mdData.id === id)
        updateMdData({
          id: '',
          userId: '',
          title: '',
          body: '',
          createdAt: undefined as unknown as Date,
          updatedAt: undefined as unknown as Date,
        })
      // ページリロードで即時反映（理想は親でリスト管理）
      window.location.reload()
    } catch (err) {
      alert('削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li
      className='flex items-center group relative'
      onClick={() => {
        if (!confirmUnsaved(isDiff)) return
        updateMdData(slide)
      }}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && confirmUnsaved(isDiff)) {
          updateMdData(slide)
        }
      }}
    >
      <Label
        htmlFor={id}
        className='block w-full px-4 py-2 border-b [&:has(input[type="radio"]:checked)]:bg-blue-200 cursor-pointer hover:bg-blue-50 transition-colors'
      >
        <input
          type='radio'
          value={id}
          id={id}
          name='allSlide'
          className='sr-only'
          defaultChecked={mdData.id === id}
        />
        <p>{title ?? '無題'}</p>
        <p className='text-right text-sm text-muted-foreground'>
          {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
        </p>
      </Label>
      <button
        type='button'
        className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 text-xs px-2 py-1 rounded hover:bg-red-100'
        onClick={handleDelete}
        disabled={isDeleting}
        tabIndex={-1}
        aria-label='スライド削除'
      >
        {isDeleting ? '削除中...' : '削除'}
      </button>
    </li>
  )
}
