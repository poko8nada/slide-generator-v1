import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import { useMemo } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'

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
  const options: SimpleMDEReactProps = useMemo(
    () => ({
      spellChecker: false,
      placeholder: 'Type here...',
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'unordered-list',
        'ordered-list',
        'link',
        'image',
        'table',
        'horizontal-rule',
        '|',
        {
          name: 'clear',
          action: (editor: EasyMDE) => {
            editor.value('') // Clear the editor content
            setMdData('') // Clear the state
          },
          className: 'fa fa-trash',
          title: 'Clear',
        },
      ],
    }),
    [setMdData],
  )
  return <SimpleMDE value={mdData} onChange={setMdData} options={options} />
}
