import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'

// Dynamic import for SimpleMDE to disable SSR
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

export default function MarkdownEditor({
  mdData,
  setMdData,
  options,
}: {
  mdData: string
  setMdData: React.Dispatch<React.SetStateAction<string>>
  options?: SimpleMDEReactProps['options']
}) {
  return <SimpleMDE value={mdData} onChange={setMdData} options={options} />
}
