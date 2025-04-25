import { useCallback, useEffect } from 'react'

export default function useMde(
  mdData: string,
  mdeRef: React.RefObject<{ getMdeInstance: () => EasyMDE } | null>,
) {
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
  }, [mdData, mdeRef])

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
  }, [updateActiveSlide, mdeRef])
}
