'use client'
import SlideSheet from '@/components/slide-sheet'
import { useSlideContainer } from '@/providers/slide-container-provider'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'

export default function DisplayAllSlide() {
  const { containerRef } = useSlideContainer()
  const [snap, setSnap] = useState<HTMLDivElement | undefined>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (containerRef.current && isOpen) {
      setSnap(containerRef.current.cloneNode(true) as HTMLDivElement)
    }
    setSnap(prev => {
      if (prev) {
        const slides = prev.querySelector('.slides')
        if (!slides) return prev
        slides.removeAttribute('style')
        slides.removeAttribute('class')
        slides.classList.add('slides')

        const sections = prev.querySelectorAll('section')
        if (!sections) return prev

        const background = (child: string) => {
          return `
          <div class="pdf-page">
          ${child}
          <div class="slide-background present" data-loaded="true" style="display: block;"><div class="slide-background-content"></div></div>
          </div>
          `
        }

        let formattedSections = ''
        for (const section of sections) {
          section.removeAttribute('style')
          section.removeAttribute('hidden')
          formattedSections += background(section.outerHTML)
        }
        slides.innerHTML = formattedSections

        const backgrounds = prev.querySelector('.backgrounds')
        if (!backgrounds) return prev
        backgrounds.innerHTML = ''
      }
      return prev
    })
  }, [isOpen, containerRef])

  return (
    <>
      <SlideSheet setIsOpen={setIsOpen}>
        {snap ? (
          <div className='h-full overflow-y-scroll reveal-print'>
            {parse(snap.outerHTML)}
          </div>
        ) : null}
      </SlideSheet>
    </>
  )
}
