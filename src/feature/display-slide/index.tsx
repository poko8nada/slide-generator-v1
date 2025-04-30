'use client'
import { useMdData } from '@/providers/md-data-provider'
import { useRef, useState } from 'react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import { useRevealInit, useRevealUpdate } from './useReveal'
import 'highlight.js/styles/monokai.min.css'
import Loader from '@/components/loader'
import SlideViewer from '@/components/slide-viewer'
import { cn } from '@/lib/utils'
import { useSlide } from '@/providers/slide-container-provider'

export default function MarkdownSlides() {
  const { mdData, activeSlideIndex } = useMdData()
  const { containerRef } = useSlide()
  const revealRef = useRef<Reveal.Api | null>(null)
  const slidesRef = useRef<HTMLDivElement | null>(null)

  const [loading, setLoading] = useState(true)
  console.log('before init')

  useRevealInit(mdData, slidesRef, containerRef, revealRef, setLoading)
  useRevealUpdate(mdData, slidesRef, activeSlideIndex, revealRef)

  console.log('after init')
  return (
    <>
      {/* <style>{layoutStyleString}</style> */}
      <div
        className={cn(
          'relative m-2',
          'min-w-[420px] max-w-[720px] w-full',
          'h-[360px]',
          'sm:h-[400px]',
          'lg:h-[425px]',
          'xl:h-[450px]',
        )}
      >
        {loading && <Loader />}
        <SlideViewer containerRef={containerRef} slidesRef={slidesRef} />
      </div>
    </>
  )
}
