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
        slides?.removeAttribute('style')
        slides?.removeAttribute('class')
        slides?.setAttribute('class', 'slides')
        const sections = prev.querySelectorAll('section')
        console.log(sections)

        // biome-ignore lint/complexity/noForEach: <explanation>
        sections.forEach(section => {
          const div = document.createElement('div')
          div.classList.add('pdf-page')
          section.removeAttribute('style')
          section.removeAttribute('hidden')
          div.appendChild(section)
          slides?.appendChild(div)
        })
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
