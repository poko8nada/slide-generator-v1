'use client'
import CustomButton from '@/components/custom-button'
import { Button } from '@/components/ui/button'
import { useSlideSnap } from '@/providers/slide-snap-provider'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { pdfDownload } from './pdfDownload'

export default function ControlUserAction() {
  const { slideSnap } = useSlideSnap()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!slideSnap) return
    setIsLoading(true)
    const error = await pdfDownload(slideSnap)
    if (error) {
      toast.error(`${error}`, {
        duration: 3000,
        style: { background: 'hsl(0 72.2% 50.6%)', color: '#fff' },
      })
      setIsLoading(false)
      return
    }
    toast.success('download success', {
      duration: 3000,
      style: { background: 'hsl(161.4 93.5% 30.4%)', color: '#fff' },
    })
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
