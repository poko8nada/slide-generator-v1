import { useEffect, useState } from 'react'

function formatSnapContent(
  container: HTMLDivElement | null,
): HTMLDivElement | null {
  if (!container) return null

  container.removeAttribute('style')
  container.removeAttribute('class')
  container.classList.add('reveal', 'center')

  const slides = container.querySelector('.slides')
  if (!slides) return container
  slides.removeAttribute('style')
  slides.removeAttribute('class')
  slides.classList.add('slides')

  const sections = container.querySelectorAll('section')
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
  slides.innerHTML = formattedSections

  const backgrounds = container.querySelector('.backgrounds')
  if (!backgrounds) return container
  backgrounds.innerHTML = ''

  return container
}

export function useCustomSnap(
  mdData: string,
  containerRef: React.RefObject<HTMLDivElement | null>,
  setSnap: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const [snapMdData, setSnapMdData] = useState('')

  // refはuseEffectの依存配列に含めなくてよい
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const container = containerRef.current
    if (!container || mdData === snapMdData) return

    const timer = setTimeout(() => {
      const snapHtml = formatSnapContent(
        container.cloneNode(true) as HTMLDivElement,
      )
      setSnap(snapHtml)
      setIsLoading(false)
      setSnapMdData(mdData)
    }, 1500) // debounce

    return () => clearTimeout(timer)
  }, [mdData, setSnap, snapMdData])
}
