import CustomSlideItem from '@/components/custom-slideItem'
import type { Slide } from '@/lib/slide-crud'

export default function DisplaySlideItemOnSheet({
  slides,
  isLoggedIn,
}: { slides: Slide[]; isLoggedIn: boolean }) {
  return (
    <div className='mt-4'>
      <div className='grid grid-cols-2 gap-x-4 px-4 py-2 font-semibold text-sm text-gray-500 border-b'>
        <span>ファイル名</span>
        <span className='text-right'>最終更新日</span>
      </div>
      <div>
        {slides.map((slide, index) => (
          <CustomSlideItem
            key={slide.id}
            slide={slide}
            defaultChecked={index === 0}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  )
}
