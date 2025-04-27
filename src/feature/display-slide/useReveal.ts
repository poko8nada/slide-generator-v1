import markdownToHtml from '@/lib/parse'
import hljs from 'highlight.js'
import { type RefObject, useCallback, useEffect, useRef } from 'react'
import type Reveal from 'reveal.js'

export function useReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  mdData: string,
  slidesRef: RefObject<HTMLDivElement | null>,
  activeSlideIndex: number,
) {
  const revealRef = useRef<Reveal.Api | null>(null)
  const getSlides = useCallback((md: string) => {
    // Markdownをスライドに分割 (3本のハイフンのみを対象)
    const slides = md
      .split(/(?<=\n|^)---(?=\n|$)/)
      .map(content => content.trim())

    // スライドをHTMLに変換
    const htmlSlides = Promise.all(
      slides.map(async slide => {
        return await markdownToHtml(slide)
      }),
    )
    return slides.length > 0 ? htmlSlides : Promise.resolve([''])
  }, [])

  const updateSlides = useCallback(
    (slides: string[]) => {
      if (!slidesRef.current || !revealRef.current) return

      const slidesContainer = slidesRef.current
      const currentSlides = Array.from(slidesContainer.children)

      // 新しいスライドを作成
      const newSlides = slides.map((html, index) => {
        const section = document.createElement('section')
        section.innerHTML = html // 安全なHTMLをセット
        // アクティブスライド以外にhidden属性をセット
        if (index !== activeSlideIndex) {
          section.setAttribute('hidden', '')
        }
        // biome-ignore lint/complexity/noForEach: <explanation>
        section.querySelectorAll('pre code').forEach(block => {
          hljs.highlightElement(block as HTMLElement) // コードブロックをハイライト
        })
        return section
      })

      // 古いスライドを削除
      // biome-ignore lint/complexity/noForEach: <explanation>
      currentSlides.forEach(slide => {
        if (slide.parentNode) {
          slide.parentNode.removeChild(slide)
        }
      })

      // 新しいスライドを追加
      // biome-ignore lint/complexity/noForEach: <explanation>
      newSlides.forEach(slide => slidesContainer.appendChild(slide))

      // Reveal.jsに同期
      requestAnimationFrame(() => {
        if (!revealRef.current) return
        try {
          revealRef.current.sync() // スライド構造を更新
          revealRef.current.layout() // スライド表示を再計算
          // アクティブスライドを強制設定
          revealRef.current.slide(activeSlideIndex, 0)
        } catch (error) {
          console.error('Reveal.js update error:', error)
        }
      })
    },
    [activeSlideIndex, slidesRef],
  )

  useEffect(() => {
    if (revealRef.current) return

    const init = async () => {
      if (!containerRef.current) return
      const Reveal = (await import('reveal.js')).default

      revealRef.current = new Reveal(containerRef.current, {
        embedded: true,
        autoSlide: false,
        transition: 'slide',
        autoAnimate: false,
        disableLayout: false,
        pdfMaxPagesPerSlide: 1,
        pdfSeparateFragments: true,
        keyboard: false,
        scrollActivationWidth: 0,
      })

      await revealRef.current.initialize()

      const slides = await getSlides(mdData)
      updateSlides(slides)
    }

    init()

    return () => {
      // クリーンアップ
      if (revealRef.current) {
        revealRef.current.destroy()
        revealRef.current = null
      }
    }
  }, [getSlides, mdData, updateSlides, containerRef])

  useEffect(() => {
    // Markdown更新時にスライドを更新
    const update = async () => {
      const slides = await getSlides(mdData)
      updateSlides(slides)
    }
    update()
  }, [mdData, getSlides, updateSlides])
}
