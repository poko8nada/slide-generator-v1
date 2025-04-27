'use client'

import { useMdData } from '@/providers/md-data-provider'
import { useRef } from 'react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import { layoutStyleString } from './custom-layout-style'
import { useReveal } from './useReveal'
import 'highlight.js/styles/monokai.min.css'
import { useSlideContainer } from '@/providers/slide-container-provider'

export default function MarkdownSlides() {
  const { mdData, activeSlideIndex } = useMdData()
  // const containerRef = useRef<HTMLDivElement | null>(null) // スライドコンテナの参照
  const slidesRef = useRef<HTMLDivElement | null>(null) // .slides要素
  const { containerRef } = useSlideContainer()

  useReveal(containerRef, mdData, slidesRef, activeSlideIndex)

  console.log(containerRef.current)
  console.log(slidesRef.current)

  return (
    <div className='flex flex-col min-h-[500px]'>
      <style>{layoutStyleString}</style>
      <div className='p-4 border-b'>
        <h2 className='font-bold text-xl'>リアルタイム Markdown スライド</h2>
        <p className='text-sm text-gray-600'>
          Markdownが変更されると自動的にスライドが更新されます
        </p>
      </div>

      <div className='flex-1 reveal !cursor-auto' ref={containerRef}>
        <div className='slides' ref={slidesRef} />
      </div>
    </div>
  )
}
