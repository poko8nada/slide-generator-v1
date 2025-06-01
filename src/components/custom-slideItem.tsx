import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { useMdData } from '@/providers/md-data-provider'

export default function CustomSlideItem({ slide }: { slide: Slide }) {
  const { setMdData, activeSlideIndex } = useMdData()
  return (
    <li className='flex items-center'>
      <RadioGroupItem value='option-one' id='option-one' />
      <Label
        htmlFor='option-one'
        className='flex justify-between px-4 py-2 border-b'
      >
        <span>{slide.title ?? '無題'}</span>
        <span className='text-right'>
          {slide.updatedAt ? new Date(slide.updatedAt).toLocaleString() : '-'}
        </span>
      </Label>
    </li>
  )
}
