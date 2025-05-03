'use client'
import CustomButton from '@/components/custom-button'
import { Button } from '@/components/ui/button'
import { useSlide } from '@/providers/slide-container-provider'
import { useSlideSnap } from '@/providers/slide-snap-provider'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { pdfDownload } from './pdfDownload'
export default function ControlUserAction() {
  const { containerRef } = useSlide()
  const { slideSnap } = useSlideSnap()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await pdfDownload(containerRef)
    setIsLoading(false)
  }

  return (
    <div className='flex items-start gap-4'>
      <CustomButton
        isLoading={isLoading}
        onClick={handleClick}
        variant={'outline'}
        icon={<Download />}
        disabled={!slideSnap}
      >
        download as PDF
      </CustomButton>
      <div className='flex flex-col items-center sm:gap-1'>
        <Button disabled className='line-through'>
          log in
        </Button>
        <span className='text-xs tracking-tight text-muted-foreground'>
          unlock in 1.0.0
        </span>
      </div>
    </div>
  )
}
