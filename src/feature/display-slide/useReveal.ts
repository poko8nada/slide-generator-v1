import { type RefObject, useEffect } from 'react'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js'

export function useReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  mdData: string | null,
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container || !mdData) return

    container.innerHTML = `
      <div class="reveal">
        <div class="slides">
          <section data-markdown>
            <textarea data-template>
              ${mdData}
            </textarea>
          </section>
        </div>
      </div>
    `

    const revealElement = container.querySelector(
      '.reveal',
    ) as HTMLElement | null
    if (!revealElement) return

    const revealInstance = new Reveal(revealElement, {
      plugins: [RevealMarkdown],
      markdown: {
        smartypants: true,
        smartLists: true,
      },
    })

    revealInstance.initialize({
      embedded: true,
      keyboard: false,
    })

    // Clean up
    return () => {
      revealInstance.destroy()
    }
  }, [containerRef, mdData])
}
