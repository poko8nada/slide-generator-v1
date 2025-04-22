'use client'

import { useMdData } from '@/providers/md-data-provider'
import { useRef } from 'react'
import { useReveal } from './useReveal'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'

export default function MarkdownSlides() {
  const { mdData } = useMdData()
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Use the custom hook
  useReveal(containerRef, mdData)

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)]'>
      <div className='p-4 border-b'>
        <h2 className='font-bold text-xl'>リアルタイム Markdown スライド</h2>
        <p className='text-sm text-gray-600'>
          Markdownが変更されると自動的にスライドが更新されます
        </p>
      </div>

      <div className='flex-1 reveal !cursor-auto' ref={containerRef} />
      {!mdData && (
        <div className='flex items-center justify-center h-full'>
          <p className='text-gray-500'>Markdownコンテンツがありません</p>
        </div>
      )}
    </div>
  )
}
