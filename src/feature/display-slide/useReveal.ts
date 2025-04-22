import { type RefObject, useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js'

export function useReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  mdData: string | null,
) {
  const revealRef = useRef<Reveal.Api | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    console.log(containerRef.current.childNodes)

    if (!mdData || mdData.trim() === '') {
      const slideDiv = containerRef.current.querySelector('.slides')
      if (slideDiv) {
        slideDiv.innerHTML = ''
      }
      return
    }

    containerRef.current.innerHTML = `
        <div class="slides">
          <section data-markdown>
            <textarea data-template>
              ${mdData}
            </textarea>
          </section>
        </div>
    `

    revealRef.current = new Reveal(containerRef.current, {
      plugins: [RevealMarkdown],
      markdown: {
        smartypants: true,
        smartLists: true,
      },
    })

    revealRef.current.initialize({
      embedded: true,
      keyboard: false,
    })

    return () => {
      try {
        if (revealRef.current) {
          revealRef.current.destroy()
          revealRef.current = null
        }
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }
  }, [containerRef, mdData])
}
