'use client'
import MarkdownEditor from '@/components/markdown-editor'
import { cn } from '@/lib/utils'
import { useMdData } from '@/providers/md-data-provider'
import { useMemo, useRef } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import {
  clearAction,
  imageUploadAction,
  imageUploadFunction,
} from './markdownAction'
import useMde from './useMde'

export default function EditMarkdown() {
  const { mdData, setMdData, setActiveSlideIndex } = useMdData()
  const mdeRef = useRef<{ getMdeInstance: () => EasyMDE } | null>(null)

  useMde(mdData, mdeRef, setActiveSlideIndex)

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
        'relative w-full m-2',
        'max-w-[720px]',
        'min-h-[371px]',
        'lg:h-[425px]',
        'xl:h-[450px]',
      )}
    >
      <MarkdownEditor
        mdData={mdData}
        setMdData={setMdData}
        options={options}
        mdeRef={mdeRef}
      />
    </div>
  )
}
