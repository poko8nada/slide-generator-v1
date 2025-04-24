import { type RefObject, useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import { parseFrontMatter } from './frontMatter'

export function useReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  mdData: string | null,
) {
  const revealRef = useRef<Reveal.Api | null>(null)
  console.log(revealRef.current)

  useEffect(() => {
    if (!containerRef.current || !mdData) return

    // Reveal を破棄
    if (revealRef.current) {
      try {
        revealRef.current.destroy()
      } catch (error) {
        console.error('Reveal destroy error:', error)
      }
      revealRef.current = null
    }

    // スライド内容の差し替え
    const { frontMatter, body } = parseFrontMatter(mdData)
    const { layout, position, common } = frontMatter

    containerRef.current.innerHTML = `
      <div class="slides">
        <div class="common ${layout} ${position}">
          <span class="text">${common}</span><span class="numbered"></span>
        </div>
        <section data-markdown>
          <textarea data-template>
          ${body}
          </textarea>
        </section>
      </div>
    `

    // Reveal 再初期化
    const revealInstance = new Reveal(containerRef.current, {
      transition: 'slide',
      plugins: [RevealMarkdown],
      markdown: {
        smartypants: true,
        smartLists: true,
      },
    })

    revealInstance
      .initialize({
        embedded: true,
        keyboard: false,
      })
      .then(() => {
        // 元のスライド位置に戻す
        revealInstance.slide(2)
      })

    revealRef.current = revealInstance

    return () => {
      try {
        revealRef.current?.destroy()
      } catch (error) {
        console.error('Reveal cleanup error:', error)
      }
      revealRef.current = null
    }
  }, [containerRef, mdData])
}
