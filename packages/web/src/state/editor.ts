import { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EditorState {
  json: SerializedEditorState<SerializedLexicalNode>
  md: string
  state: string
  update: (editorState: Partial<Omit<EditorState, 'update'>>) => void
}

export const useEditorState = create<EditorState>()(
  persist(
    (set) => ({
      json: {} as SerializedEditorState<SerializedLexicalNode>,
      md: '',
      state: '',
      update: (editorState: Partial<EditorState>) => set((state) => ({ ...state, ...editorState })),
    }),
    {
      name: 'editor-storage', // unique name
    },
  ),
)
