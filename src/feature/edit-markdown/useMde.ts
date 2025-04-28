import { useCallback, useEffect } from 'react'

export default function useMde(
  mdData: string,
  mdeRef: React.RefObject<{ getMdeInstance: () => EasyMDE } | null>,
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>,
) {
  const updateActiveSlide = useCallback(() => {
    try {
      if (!mdData) return
      if (!mdeRef.current) return

      const mdeInstance = mdeRef.current?.getMdeInstance()
      if (!mdeInstance) return

      const cm = mdeInstance.codemirror
      const cursor = cm.getCursor()
      const textBeforeCursor = mdData.slice(0, cm.indexFromPos(cursor))
      //  スライドの区切り(3本のハイフンのみを対象)
      const slideBreaks =
        textBeforeCursor.split(/(?<=\n|^)---(?=\n|$)/).length - 1
      const slideIndex = Math.max(0, slideBreaks)
      setActiveSlideIndex(slideIndex)
    } catch (error) {
      console.error('Error in updateActiveSlide:', error)
      throw new Error('Failed to update active slide.')
    }
  }, [mdData, mdeRef, setActiveSlideIndex])

  useEffect(() => {
    try {
      const mdeInstance = mdeRef.current?.getMdeInstance()
      if (!mdeInstance) return

      const cm = mdeInstance.codemirror
      // カーソル移動や編集時にスライドインデックスを更新
      cm.on('cursorActivity', updateActiveSlide)
      cm.on('change', updateActiveSlide)

      cm.setSize('100%', '360px') // 高さを360pxに設定

      // 初期スライドインデックスを設定
      updateActiveSlide()
    } catch (error) {
      console.error('Error during MDE initialization:', error)
      throw new Error('Failed to initialize MDE.')
    }

    return () => {
      try {
        const mdeInstance = mdeRef.current?.getMdeInstance()
        if (!mdeInstance) return

        const cm = mdeInstance.codemirror
        cm.off('cursorActivity', updateActiveSlide)
        cm.off('change', updateActiveSlide)
      } catch (cleanupError) {
        console.error('Error during MDE cleanup:', cleanupError)
      }
    }
  }, [updateActiveSlide, mdeRef])
}
