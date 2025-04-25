// import { parseFrontMatter } from './frontMatter'
import markdownToHtml from '@/lib/parse'
import { type RefObject, useCallback, useEffect, useRef } from 'react'
import Reveal from 'reveal.js'

export function useReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  mdData: string,
  slidesRef: RefObject<HTMLDivElement | null>,
  activeSlideIndex: number,
) {
  const revealRef = useRef<Reveal.Api | null>(null)
  const getSlides = useCallback((md: string) => {
    // Markdownをスライドに分割
    const slides = md.split('---').map(content => content.trim())

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
    if (!containerRef.current) return

    revealRef.current = new Reveal(containerRef.current, {
      embedded: true, // 埋め込みモード
      autoSlide: false, // 自動スライド無効
      transition: 'slide', // トランジション
      autoAnimate: false, // アニメーションによるズレを防止
      disableLayout: false, // レイアウト計算を有効
    })
    // Reveal.jsの初期化
    revealRef.current.initialize()

    const initializeSlides = async () => {
      const slides = await getSlides(mdData)
      updateSlides(slides)
    }
    initializeSlides()

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
