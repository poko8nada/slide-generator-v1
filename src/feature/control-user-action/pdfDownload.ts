import jsPDF from 'jspdf'

export async function pdfDownload(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  if (!containerRef.current) return

  const containerClone = document
    .querySelector('.reveal-print')
    ?.cloneNode(true) as HTMLDivElement

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
    const images = slide.querySelectorAll('img')
    for (const image of images) {
      image.src = `${image.src}?v=${Date.now()}`
    }
    try {
      //   const data = await toJpeg(slide, {
      //     quality: 1,
      //     width: formatSize[0],
      //     height: formatSize[1],
      //     canvasWidth: formatSize[0],
      //     canvasHeight: formatSize[1],
      //     skipFonts: true,
      //     style: {
      //       transform: `scale(${scale})`,
      //       transformOrigin: 'top left',
      //     },
      //   })

      document.body.appendChild(slide)

      // dataURLの詳細をコンソール出力
      // console.log(`Slide ${index + 1} dataURL length:`, data.length)
      // console.log(`Slide ${index + 1} dataURL prefix:`, data.substring(0, 50))

      // pdf.addImage(data, 'JPEG', 0, 0, formatSize[0], formatSize[1])
      // pdf.addPage()
    } catch (_) {
      console.log(index + 1, 'page failed')
    }
    // pdf.deletePage(pdf.getNumberOfPages())
    // 処理後に containerClone を削除
    // containerClone?.parentNode?.removeChild(containerClone)
    // await pdf.save('slide.pdf', { returnPromise: true })
  }
}
