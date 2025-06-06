'use client'
import MarkdownEditor from '@/components/markdown-editor'
import type { Slide } from '@/lib/slide-crud'
import { cn } from '@/lib/utils'
import { initialMarketingBody, useMdData } from '@/providers/md-data-provider'
import { useMemo, useRef, useState } from 'react'
import type { SimpleMDEReactProps } from 'react-simplemde-editor'
import {
  clearAction,
  imageUploadAction,
  imageUploadFunction,
} from './markdownAction'
import {
  useDiffMarkdownEffect,
  useInitMarkdownEffect,
} from './useEditMarkdownEffects'
import useMde from './useMde'
import CustomButton from '@/components/custom-button'
import { Save } from 'lucide-react'
import Form from 'next/form'
import { updateSlide } from '@/lib/slide-crud'
import type { Session } from 'next-auth'

export default function EditMarkdown({
  initialSlide,
  session,
}: {
  initialSlide: Slide | null
  session: Session | null
}) {
  const {
    mdData,
    updateMdBody,
    updateMdData,
    setActiveSlideIndex,
    isDiff,
    setIsDiff,
  } = useMdData()
  const mdeRef = useRef<{ getMdeInstance: () => EasyMDE } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useMde(mdData.body, mdeRef, setActiveSlideIndex)

  // 初期化・スライド切替時の副作用
  useInitMarkdownEffect(
    initialSlide,
    initialMarketingBody,
    updateMdBody,
    updateMdData,
  )

  useDiffMarkdownEffect(mdData, initialMarketingBody, setIsDiff)

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
      {initialSlide && (
        <Form
          action={async () => {
            setIsSaving(true)
            await updateSlide(mdData.id, mdData.body, session)
            setIsSaving(false)
          }}
        >
          <CustomButton
            className='absolute top-2 right-2'
            isLoading={isSaving}
            disabled={!isDiff}
          >
            <Save /> save
          </CustomButton>
        </Form>
      )}
    </div>
  )
}
