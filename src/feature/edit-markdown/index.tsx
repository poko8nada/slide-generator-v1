'use client'
import CustomButton from '@/components/custom-button'
import MarkdownEditor from '@/components/markdown-editor'
import type { Slide } from '@/lib/slide-crud'
import { cn } from '@/lib/utils'
import { initialMarketingBody, useMdData } from '@/providers/md-data-provider'
import { useEffect, useMemo, useRef } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import {
  clearAction,
  imageUploadAction,
  imageUploadFunction,
} from './markdownAction'
import useMde from './useMde'

export default function EditMarkdown({
  initialSlide,
}: {
  initialSlide: Slide | null
}) {
  const { mdData, updateMdBody, setActiveSlideIndex } = useMdData()
  const mdeRef = useRef<{ getMdeInstance: () => EasyMDE } | null>(null)

  useMde(mdData.body, mdeRef, setActiveSlideIndex)

  // 初回レンダリング時に初期値をセット
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!initialSlide) {
      updateMdBody(initialMarketingBody)
    } else {
      updateMdBody(initialSlide.body)
    }
  }, [initialSlide])

  // const [originalMdData, _setOriginalMdData] = useState(mdData)
  // const [_isSaving, _setIsSaving] = useState(false)

  // const hasChanged = mdData !== originalMdData

  // console.log(`hasChanged ${hasChanged}`)

  const options: SimpleMDEReactProps['options'] = useMemo(
    () => ({
      scrollbarStyle: 'native',
      spellChecker: false,
      uploadImage: true,
      imageUploadFunction,
      placeholder: 'Type here...',
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'unordered-list',
        'ordered-list',
        'link',
        'table',
        'horizontal-rule',
        '|',
        'image',
        {
          name: 'image-upload',
          action: (editor: EasyMDE) => {
            imageUploadAction(editor)
          },
          className: 'fa fa-upload',
          title: 'Upload Image',
        },
        '|',
        {
          name: 'clear',
          action: (editor: EasyMDE) => {
            if (window.confirm('Are you sure you want to clear the content?')) {
              clearAction(editor)
            }
          },
          className: 'fa fa-trash',
          title: 'Clear',
        },
      ],
    }),
    [],
  )

  return (
    <div
      className={cn(
        'relative w-full',
        'max-w-[640px]',
        'min-h-[371px]',
        'lg:h-[425px]',
        'xl:h-[450px]',
      )}
    >
      <MarkdownEditor
        mdDataBody={mdData.body}
        updateMdBody={updateMdBody}
        options={options}
        mdeRef={mdeRef}
      />
      {mdeRef.current && (
        <CustomButton className='absolute top-2 right-2'>save</CustomButton>
      )}
    </div>
  )
}
