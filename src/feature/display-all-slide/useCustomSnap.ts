import { useEffect, useState } from 'react'

function formatSnapContent(
  container: HTMLDivElement | null,
): HTMLDivElement | null {
  try {
    if (!container) {
      console.error('Container is null')
      return null
    }

    container.removeAttribute('style')
    container.removeAttribute('class')
    container.classList.add('reveal', 'center')

    const snapWrapper = document.createElement('div')
    snapWrapper.classList.add('reveal-print')
    snapWrapper.appendChild(container as Node)

    const slides = container?.querySelector('.slides') as HTMLDivElement | null
    if (!slides) return container
    if (slides) {
      slides.removeAttribute('style')
      slides.removeAttribute('class')
      slides.classList.add('slides')
    }

    const sections = container?.querySelectorAll('section') as
      | NodeListOf<HTMLElement>
      | undefined
    if (!sections) return container

    const background = (child: string) => {
      return `
      <div class="pdf-page" style="background:var(--r-background-color);">
      ${child}
      <div class="slide-background present" data-loaded="true" style="display: block;"><div class="slide-background-content"></div></div>
      </div>
      `
    }

    let formattedSections = ''
    for (const section of sections) {
      section.removeAttribute('style')
      section.removeAttribute('hidden')
      formattedSections += background(section.outerHTML)
    }
    if (slides) {
      slides.innerHTML = formattedSections
    }

    const backgrounds = container?.querySelector(
      '.backgrounds',
    ) as HTMLDivElement | null
    if (!backgrounds) return container
    if (backgrounds) {
      backgrounds.innerHTML = ''
    }

    return snapWrapper
  } catch (error) {
    console.error('Error formatting snap content:', error)
    return null
  }
}

export function useCustomSnap(
  mdData: string,
  containerRef: React.RefObject<HTMLDivElement | null>,
  setSlideSnap: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const [snapMdData, setSnapMdData] = useState('')

  // refはuseEffectの依存配列に含めなくてよい
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const container = containerRef.current
    if (!container || mdData === snapMdData) return

    const processSnap = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)) // debounce
        const snapHtml = formatSnapContent(
          container.cloneNode(true) as HTMLDivElement,
        )
        if (!snapHtml) {
          throw new Error('スライド生成に失敗しました')
        }
        setSlideSnap(snapHtml)
      } catch (error) {
        console.error(error)
        setSlideSnap(null)
        throw error
      } finally {
        setIsLoading(false)
        setSnapMdData(mdData)
      }
    }

    processSnap().catch(error => {
      throw error
    })
  }, [mdData, setSlideSnap, snapMdData])
}
