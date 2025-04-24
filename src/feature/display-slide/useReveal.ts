import { type RefObject, useEffect, useRef } from 'react'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import { parseFrontMatter } from './frontMatter'

export function useReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  mdData: string | null,
) {
  const revealRef = useRef<Reveal.Api | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    // console.log(containerRef.current.childNodes)

    if (!mdData || mdData.trim() === '') {
      const slideDiv = containerRef.current.querySelector('.slides')
      if (slideDiv) {
        slideDiv.innerHTML = ''
      }
      return
    }

    const { frontMatter, body } = parseFrontMatter(mdData)
    const { common, layout, position, number } = frontMatter
    console.log('frontMatter', frontMatter)

    // const headerStyle = `
    // padding: 10px;
    // `
    // const headerRegex = /---header---\n([\s\S]*?)\n---header---/g
    // const parsedMdData = mdData.replace(headerRegex, (_, headerContent) => {
    //   return `<div class="header" style="${headerStyle}">${headerContent.trim()}</div>`
    // })

    containerRef.current.innerHTML = `
        <div class="slides">
          <div class="common ${layout} ${position}"><span class="text">${common}</span><span class="numbered"></span></div>
          <section data-markdown>
          <textarea data-template>
          ${body}
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

    // 初期化を完了させる
    const initPromise = revealRef.current.initialize({
      embedded: true,
      keyboard: false,
    })

    if (initPromise && typeof initPromise.then === 'function') {
      initPromise.then(() => {
        console.log('Reveal initialized, now adding event listener')

        if (containerRef.current && revealRef.current) {
          const sectionsLength =
            containerRef.current.querySelectorAll('section').length
          const numbered = containerRef.current.querySelector('.numbered')

          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const slideChangedCallback = (event: any) => {
            if (numbered) {
              numbered.innerHTML = `${event.indexh + 1}/${sectionsLength}`
            }
          }
          if (numbered && number) {
            numbered.innerHTML = `1/${sectionsLength}`
            revealRef.current.on('slidechanged', slideChangedCallback)
          }
          return () => {
            if (revealRef.current) {
              revealRef.current.off('slidechanged', slideChangedCallback)
            }
          }
        }
      })
    }

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
