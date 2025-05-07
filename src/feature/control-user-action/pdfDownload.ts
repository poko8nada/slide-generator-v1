import { toJpeg } from 'html-to-image'
import jsPDF from 'jspdf'

function createCloneSlides(slideSnap: HTMLDivElement) {
  const containerClone = slideSnap?.cloneNode(true) as HTMLDivElement

  if (containerClone) {
    // 一時的に document.body に追加
    containerClone.style.position = 'absolute'
    containerClone.style.left = '-9999px'
    containerClone.style.visibility = 'hidden'
    document.body.appendChild(containerClone)
  }

  const slides = containerClone.querySelectorAll(
    '.pdf-page',
  ) as NodeListOf<HTMLDivElement>

  return { slides, containerClone }
}

async function imgProxy(slide: HTMLDivElement) {
  const images = slide.querySelectorAll('img')
  if (images.length === 0) return Promise.resolve({ ok: true })

  for (const image of images) {
    const src = image.src
    if (src.startsWith('blob:') || src.startsWith('data:')) {
      return Promise.resolve({ ok: true })
    }
    const externalUrl = encodeURIComponent(image.src)
    const proxyUrl = `${externalUrl}&t=${Date.now()}`

    image.src = `/api/image-proxy?url=${proxyUrl}`
    return (await fetch(image.src)) || { ok: false }
  }
}

function customListStyle(slide: HTMLDivElement) {
  // li要素のテキストノードを処理して半角カンマを含む部分をspanでラップ
  // カンマが入っている場合、改行されて次行と重なる可能性があるため
  const liElements = slide.querySelectorAll('li')
  for (const li of liElements) {
    const textNodes = Array.from(li.childNodes).filter(
      node => node.nodeType === Node.TEXT_NODE,
    )
    for (const textNode of textNodes) {
      const text = textNode?.nodeValue
      if (text?.includes(',')) {
        const parts = text.split(',')
        const fragment = document.createDocumentFragment()
        for (const [index, part] of parts.entries()) {
          const span = document.createElement('span')
          span.textContent = part
          if (index < parts.length - 1) {
            span.classList.add('nowrap-comma')
            fragment.appendChild(span)
            const comma = document.createTextNode(',')
            fragment.appendChild(comma)
          } else {
            fragment.appendChild(span)
          }
        }
        li.replaceChild(fragment, textNode)
      }
    }
  }
}

export async function pdfDownload(slideSnap: HTMLDivElement) {
  const { slides, containerClone } = createCloneSlides(slideSnap)
  if (slides.length === 0) return

  const scale = 4.0
  const formatSize = [
    slides[0].offsetWidth * scale,
    slides[0].offsetHeight * scale,
  ]

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: formatSize,
  })

  for (const [index, slide] of slides.entries()) {
    const res = await imgProxy(slide)

    try {
      if (!res || !res.ok) {
        const errJson =
          res instanceof Response
            ? await res.json()
            : { message: 'Unknown error' }
        console.log(errJson)

        throw new Error(
          `Slide No ${index + 1}: Failed to fetch image "${
            (errJson as { message: string }).message
          }"`,
        )
      }

      customListStyle(slide)
      const data = await toJpeg(slide, {
        quality: 1,
        width: formatSize[0],
        height: formatSize[1],
        canvasWidth: formatSize[0],
        canvasHeight: formatSize[1],
        skipFonts: true,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        },
      })

      // // デバッグ用: JPEG画像を一時保存して確認
      // const link = document.createElement('a')
      // link.href = data
      // link.download = `slide_${index + 1}.jpeg`
      // link.click()
      // // dataURLの詳細をコンソール出力
      // console.log(`Slide ${index + 1} dataURL length:`, data.length)
      // console.log(`Slide ${index + 1} dataURL prefix:`, data.substring(0, 50))

      pdf.addImage(data, 'JPEG', 0, 0, formatSize[0], formatSize[1])
      pdf.addPage()
    } catch (err) {
      if (err instanceof Error) {
        return err
      }
      return new Error('Unknown error')
    }
  }

  // 処理後に containerClone を削除
  containerClone?.parentNode?.removeChild(containerClone)
  pdf.deletePage(pdf.getNumberOfPages())
  await pdf.save('slide.pdf', { returnPromise: true })
}
