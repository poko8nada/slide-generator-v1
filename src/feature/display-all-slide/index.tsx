'use client'
import CustomButton from '@/components/custom-button'
import SlideSheet from '@/components/slide-sheet'
import { useSlideContainer } from '@/providers/slide-container-provider'
import parse from 'html-react-parser'
import { useState } from 'react'
import { handleDownload } from './handleDownload'
import { useCustomSnap } from './useCustomSnap'

export default function DisplayAllSlide() {
  const { containerRef } = useSlideContainer()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const snap = useCustomSnap(
    isOpen,
    containerRef as React.RefObject<HTMLDivElement>,
  )

  return (
    <>
      <SlideSheet setIsOpen={setIsOpen}>
        {snap ? (
          <div className='!h-[85%] overflow-y-scroll reveal-print'>
            {parse(snap.outerHTML)}
          </div>
        ) : null}
        <div className='m-4 flex justify-center'>
          <CustomButton
            onClick={() => handleDownload(containerRef, isOpen, setIsLoading)}
            isLoading={isLoading}
          >
            download pdf
          </CustomButton>
        </div>
      </SlideSheet>
    </>
  )
}
