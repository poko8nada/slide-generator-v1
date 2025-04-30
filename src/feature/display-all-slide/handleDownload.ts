import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export async function handleDownload(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean,
  setIsLoading: (loading: boolean) => void,
) {
  if (!isOpen || !containerRef.current) return

  setIsLoading(true)

  const revealViewPort = document.querySelector(
    '.reveal-viewport',
  ) as HTMLElement
  const backGroundColor =
    window.getComputedStyle(revealViewPort).backgroundColor

  const slides = document.querySelectorAll(
    '.reveal-print .slides .pdf-page',
  ) as NodeListOf<HTMLDivElement>
  if (!slides) return

  const scale = 2.0
  const formatSize = [
    slides[0].offsetWidth * scale,
    slides[0].offsetHeight * scale,
  ]

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: formatSize,
  })

  for (const slide of slides) {
    await html2canvas(slide, {
      useCORS: true,
      backgroundColor: backGroundColor,
      scale: scale,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/webp')
      pdf.addImage(imgData, 'webp', 0, 0, canvas.width, canvas.height)
      pdf.addPage()
    })
  }
  pdf.deletePage(pdf.getNumberOfPages())
  await pdf.save('slide.pdf', { returnPromise: true })
  setIsLoading(false)
}
