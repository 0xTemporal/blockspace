import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { EditorState } from 'lexical/LexicalEditorState'
import React from 'react'

import { useEditorState } from '@/src/state'

export function RestoreFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext()
  const { json, update } = useEditorState()
  const [isFirstRender, setIsFirstRender] = React.useState(true)

  React.useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)

      if (json) {
        const initialEditorState = editor.parseEditorState(json)
        editor.setEditorState(initialEditorState)
      }
    }
  }, [isFirstRender, json, editor])

  const onChange = React.useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const md = $convertToMarkdownString(TRANSFORMERS)
        update({
          md,
          json: editorState.toJSON(),
        })
      })
    },
    [update],
  )

  return <OnChangePlugin onChange={onChange} />
}
