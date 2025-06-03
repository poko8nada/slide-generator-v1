'use client'
import { Label } from '@/components/ui/label'
import type { Slide } from '@/lib/slide-crud'
import { useMdData } from '@/providers/md-data-provider'
import { confirmUnsaved } from '@/lib/unsaved-warning'

export default function CustomSlideItem({
  slide,
  defaultChecked,
}: { slide: Slide; defaultChecked: boolean }) {
  if (!slide) return null

  const { updateMdData, isDiff } = useMdData()
  const { id, title, body, createdAt, updatedAt } = slide

  return (
    <li
      className='flex items-center'
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
          defaultChecked={defaultChecked}
        />
        <p>{title ?? '無題'}</p>
        <p className='text-right text-sm text-muted-foreground'>
          {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
        </p>
      </Label>

      {/* <div className='sr-only'>{body}</div> */}
    </li>
  )
}
