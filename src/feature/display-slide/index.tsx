'use client'

import { useMdData } from '@/providers/md-data-provider'
import { useRef } from 'react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import { layoutStyleString } from './custom-layout-style'
import { useRevealInit, useRevealUpdate } from './useReveal'
import 'highlight.js/styles/monokai.min.css'
import SlideViewer from '@/components/slide-viewer'
import { useSlideContainer } from '@/providers/slide-container-provider'

export default function MarkdownSlides() {
  const { mdData, activeSlideIndex } = useMdData()
  const slidesRef = useRef<HTMLDivElement | null>(null)
  const { containerRef } = useSlideContainer()
  const revealRef = useRef<Reveal.Api | null>(null)

  console.log('before init')

  useRevealInit(mdData, slidesRef, containerRef, revealRef)
  useRevealUpdate(mdData, slidesRef, activeSlideIndex, revealRef)

  console.log('after init')
  return (
    <div className='flex flex-col min-h-[500px]'>
      <style>{layoutStyleString}</style>
      <div className='p-4 border-b'>
        <h2 className='font-bold text-xl'>リアルタイム Markdown スライド</h2>
        <p className='text-sm text-gray-600'>
          Markdownが変更されると自動的にスライドが更新されます
        </p>
      </div>

      {/* {loading ? (
        <div>Loading...</div>
      ) : ( */}
      {/* // <div className='flex-1 reveal !cursor-auto' ref={containerRef}>
        //   <div className='slides' ref={slidesRef} />
        // </div> */}
      <SlideViewer containerRef={containerRef} slidesRef={slidesRef} />
      {/* )} */}
    </div>
  )
}
