/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import Nodes from './nodes'
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import DragDropPaste from './plugins/DragDropPastePlugin'
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin'
import EquationsPlugin from './plugins/EquationsPlugin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin'
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin'
import ImagesPlugin from './plugins/ImagesPlugin'
import KeywordsPlugin from './plugins/KeywordsPlugin'
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin'
import LinkPlugin from './plugins/LinkPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin'
import PollPlugin from './plugins/PollPlugin'
import { RestoreFromLocalStoragePlugin } from './plugins/RestoreFromLocalStoragePlugin'
import TabFocusPlugin from './plugins/TabFocusPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import TwitterPlugin from './plugins/TwitterPlugin'
import YouTubePlugin from './plugins/YouTubePlugin'
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme'
import ContentEditable from './ui/ContentEditable'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin'
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { useEffect, useState } from 'react'

import { useSharedHistoryContext } from './context/SharedHistoryContext'
import { SharedHistoryContext } from './context/SharedHistoryContext'

import { CAN_USE_DOM } from './utils/dom'

import './index.css'

export function Editor(): JSX.Element {
  const initialConfig = {
    namespace: 'blockspace-editor',
    nodes: [...Nodes],
    onError: (error: Error) => {
      throw error
    },
    theme: PlaygroundEditorTheme,
  } satisfies InitialConfigType

  const { historyState } = useSharedHistoryContext()

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false)
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport)
      }
    }
    updateViewPortWidth()
    window.addEventListener('resize', updateViewPortWidth)

    return () => {
      window.removeEventListener('resize', updateViewPortWidth)
    }
  }, [isSmallWidthViewport])

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <div className="relative mx-6 w-full space-y-4">
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
          <div className={`max-w-[68ch] mx-auto`}>
            <DragDropPaste />
            <AutoFocusPlugin />
            <ClearEditorPlugin />
            <AutoEmbedPlugin />
            <RestoreFromLocalStoragePlugin />
            <HashtagPlugin />
            <KeywordsPlugin />
            <AutoLinkPlugin />
            <div className="relative !-mt-6 rounded-lg p-3 transition-colors focus-within:bg-foreground-50 hover:bg-foreground-50">
              <HistoryPlugin externalHistoryState={historyState} />
              <RichTextPlugin
                contentEditable={
                  <div className="z-0 overflow-auto min-h-[150px] border-none flex relative outline-none">
                    <div className="editor" ref={onRef}>
                      <ContentEditable className="!min-h-[67vh]" />
                    </div>
                  </div>
                }
                placeholder={
                  <div className="pointer-events-none absolute left-10 top-[31px] text-foreground/60">
                    Enter some text...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <MarkdownShortcutPlugin />
              <CodeHighlightPlugin />
              <ListPlugin />
              <CheckListPlugin />
              <ListMaxIndentLevelPlugin maxDepth={7} />
              <ImagesPlugin />
              <LinkPlugin />
              <PollPlugin />
              <TwitterPlugin />
              <YouTubePlugin />
              <LexicalClickableLinkPlugin />
              <HorizontalRulePlugin />
              <EquationsPlugin />
              <TabFocusPlugin />
              <TabIndentationPlugin />
              <LayoutPlugin />
              {floatingAnchorElem && !isSmallWidthViewport && (
                <>
                  <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                  <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                  <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                  />
                  {/* <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} /> */}
                  <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
                </>
              )}
            </div>

            {/* <TableOfContentsPlugin /> */}
          </div>
        </div>
      </SharedHistoryContext>
    </LexicalComposer>
  )
}
