'use client';

import ToolbarPlugin from './editor-toolbar';
import { ImageNode } from './nodes/image-node';
import ImagesPlugin from './plugins/image';
import { RestoreFromLocalStoragePlugin } from './plugins/local-storage';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { EditorState, EditorThemeClasses, LexicalEditor } from 'lexical';

import { useSharedHistoryContext } from './context/shared-history';

const theme = {
  root: 'h-auto min-h-[67vh] outline-none prose [&_*]:text-foreground',
  link: 'cursor-pointer',
  // text: {
  //   base: 'font-normal',
  //   bold: 'font-semibold',
  //   underline: 'underline',
  //   italic: 'italic',
  //   strikethrough: 'line-through',
  // },
  // heading: {
  //   h1: 'text-4xl',
  //   h2: 'text-3xl',
  //   h3: 'text-2xl',
  //   h4: 'text-xl',
  //   h5: 'text-lg',
  // },
  list: {
    // ol: 'list-decimal',
    // ul: 'list-disc',
    nested: {
      listitem: 'list-none',
    },
  },
} satisfies EditorThemeClasses;

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
      attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
    };
  },
];

export function Editor({
  onChange,
}: {
  onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
}) {
  function onError(error: Error) {
    console.error(error);
  }

  const initialConfig = {
    namespace: 'Editor',
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      HorizontalRuleNode,
      ImageNode,
    ],
    onError,
  } satisfies InitialConfigType;

  const { historyState } = useSharedHistoryContext();

  return (
    <div className="relative mx-6 -mt-12 w-full space-y-4">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />

        <div className="relative !-mt-6 rounded-lg p-3 transition-colors focus-within:bg-foreground-50 hover:bg-foreground-50">
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={
              <div className="pointer-events-none absolute left-3 top-3.5 text-foreground/60">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin externalHistoryState={historyState} />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <ImagesPlugin />
        <TabIndentationPlugin />
        <RestoreFromLocalStoragePlugin />
        <OnChangePlugin onChange={onChange} />
        <AutoLinkPlugin matchers={MATCHERS} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </LexicalComposer>
    </div>
  );
}
