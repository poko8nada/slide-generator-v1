'use client'
import SlideSheet from '@/components/slide-sheet'
import { Button } from '@/components/ui/button'
import { useSlideContainer } from '@/providers/slide-container-provider'
import parse from 'html-react-parser'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
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
  const handleDownload = async () => {
    const revealViewPort = document.querySelector(
      '.reveal-viewport',
    ) as HTMLElement
    const backGroundColor =
      window.getComputedStyle(revealViewPort).backgroundColor
    console.log(backGroundColor)

    const slides = document.querySelectorAll(
      '.reveal-print .slides .pdf-page',
    ) as NodeListOf<HTMLDivElement>
    if (!slides) return

    const scale = 2.0
    const formatSize = [
      slides[0].offsetWidth * scale,
      slides[0].offsetHeight * scale,
    ]
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: formatSize,
    })

    for (const slide of slides) {
      await html2canvas(slide, {
        useCORS: true,
        backgroundColor: backGroundColor,
        scale: scale,
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.addPage()
      })
    }
    pdf.deletePage(pdf.getNumberOfPages())
    pdf.save('slide.pdf')
  }

  return (
    <>
      <SlideSheet setIsOpen={setIsOpen}>
        {snap ? (
          <div className='!h-[85%] overflow-y-scroll reveal-print'>
            {parse(snap.outerHTML)}
          </div>
        ) : null}
        <div className='m-4 flex justify-center'>
          <Button onClick={handleDownload}>download pdf</Button>
        </div>
      </SlideSheet>
    </>
  )
}
