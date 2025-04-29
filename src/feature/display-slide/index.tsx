'use client'
import { useMdData } from '@/providers/md-data-provider'
import { useRef, useState } from 'react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import { layoutStyleString } from './custom-layout-style'
import { useRevealInit, useRevealUpdate } from './useReveal'
import 'highlight.js/styles/monokai.min.css'
import Loader from '@/components/loader'
import SlideViewer from '@/components/slide-viewer'
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
    <div className='container'>
      <style>{layoutStyleString}</style>

      <div className='relative h-[400px]'>
        {loading && <Loader />}
        <SlideViewer containerRef={containerRef} slidesRef={slidesRef} />
        {/* )} */}
      </div>
    </div>
  )
}
