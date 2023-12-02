'use client'

import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { Button } from '@nextui-org/react'
import { EditorState } from 'lexical'
import Link from 'next/link'
import { useState } from 'react'
import { LuPenSquare, LuPresentation } from 'react-icons/lu'

import { Editor } from '@/src/components/editor'
import { useEditorState } from '@/src/state'

export function Journal() {
  const [submitting, setSubmitting] = useState(false)

  const { update } = useEditorState()

  const onSubmit = () => {
    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
    }, 3000)
  }

  const onEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const md = $convertToMarkdownString(TRANSFORMERS)
      update({
        md,
        json: editorState.toJSON(),
      })
    })
  }

  return (
    <div className="relative">
      <div className="container max-w-[68ch]">
        <Editor onChange={onEditorChange} />
      </div>

      <div className="fixed bottom-8 right-8 flex items-center gap-x-2 opacity-60 transition-opacity focus-within:opacity-100 hover:opacity-100">
        {/**
         * re-add later for drafts
         *
         * <Button isIconOnly radius="full">
         *  <LuSave />
         * </Button>
         *
         */}
        <Button as={Link} isIconOnly radius="full" href="/journal/preview">
          <LuPresentation />
        </Button>
        <Button radius="full" color="primary" onClick={onSubmit} isLoading={submitting}>
          Submit <LuPenSquare />
        </Button>
      </div>
    </div>
  )
}
