import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'

// Dynamic import for SimpleMDE to disable SSR
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

export default function MarkdownEditor({
  mdData,
  setMdData,
}: {
  mdData: string
  setMdData: React.Dispatch<React.SetStateAction<string>>
}) {
  return <SimpleMDE value={mdData} onChange={setMdData} />
}
