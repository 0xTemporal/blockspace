import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';
import React from 'react';

import { useEditorState } from '@/src/state';

export function RestoreFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const { update, state } = useEditorState();
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);

      if (state) {
        const initialEditorState = editor.parseEditorState(state);
        editor.setEditorState(initialEditorState);
      }
    }
  }, [isFirstRender, state, editor]);

  const onChange = React.useCallback(
    (editorState: EditorState) => {
      update({ state: JSON.stringify(editorState.toJSON()) });
    },
    [update],
  );

  return <OnChangePlugin onChange={onChange} />;
}
