import { toJpeg } from 'html-to-image'
import jsPDF from 'jspdf'

export async function pdfDownload(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  if (!containerRef.current) return

  const slides = document.querySelectorAll(
    '.reveal-print .slides .pdf-page',
  ) as NodeListOf<HTMLDivElement>
  if (!slides) return

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
    try {
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

      pdf.addImage(data, 'JPEG', 0, 0, formatSize[0], formatSize[1])
      pdf.addPage()
    } catch (_) {
      console.log(index)
    }
  }
  pdf.deletePage(pdf.getNumberOfPages())
  await pdf.save('slide.pdf', { returnPromise: true })
}
