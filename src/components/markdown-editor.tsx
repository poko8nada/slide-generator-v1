'use client'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import 'easymde/dist/easymde.min.css'
import type EasyMDE from 'easymde'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'

// Dynamic import for SimpleMDE to disable SSR
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

export default function MarkdownEditor({
  mdData,
  setMdData,
  options,
}: {
  mdData: string
  setMdData: React.Dispatch<React.SetStateAction<string>>
  options?: SimpleMDEReactProps['options']
}) {
  const mdeRef = useRef<{ getMdeInstance: () => EasyMDE } | null>(null)

  // カーソル位置から編集中のスライドを計算
  const updateActiveSlide = useCallback(() => {
    if (!mdData) return
    if (!mdeRef.current) return

    const mdeInstance = mdeRef.current?.getMdeInstance()
    if (!mdeInstance) return

    const cm = mdeInstance.codemirror
    const cursor = cm.getCursor()
    const textBeforeCursor = mdData.slice(0, cm.indexFromPos(cursor))
    const slideBreaks = textBeforeCursor.split('---').length - 1
    const slideIndex = Math.max(0, slideBreaks)
    // setActiveSlideIndex(slideIndex);
    console.log(`Current slide index: ${slideIndex}`) // デバッグ用;
  }, [mdData])

  useEffect(() => {
    const mdeInstance = mdeRef.current?.getMdeInstance()
    if (!mdeInstance) return

    const cm = mdeInstance.codemirror
    // カーソル移動や編集時にスライドインデックスを更新
    cm.on('cursorActivity', updateActiveSlide)
    cm.on('change', updateActiveSlide)

    // 初期スライドインデックスを設定
    updateActiveSlide()

    return () => {
      cm.off('cursorActivity', updateActiveSlide)
      cm.off('change', updateActiveSlide)
    }
  }, [updateActiveSlide])

  return (
    <SimpleMDE
      value={mdData}
      onChange={setMdData}
      options={options}
      getMdeInstance={instance => {
        mdeRef.current = { getMdeInstance: () => instance }
      }}
    />
  )
}
