import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import type EasyMDE from 'easymde'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import MdeLoader from './mde-loader'

// Dynamic import for SimpleMDE to disable SSR
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => <MdeLoader />,
})

export default function MarkdownEditor({
  mdData,
  setMdData,
  options,
  mdeRef,
}: {
  mdData: string
  setMdData: React.Dispatch<React.SetStateAction<string>>
  options?: SimpleMDEReactProps['options']
  mdeRef: React.RefObject<{ getMdeInstance: () => EasyMDE } | null>
}) {
  return (
    <SimpleMDE
      value={mdData}
      onChange={setMdData}
      options={options}
      getMdeInstance={instance => {
        mdeRef.current = { getMdeInstance: () => instance }
      }}
    />
  )
}
