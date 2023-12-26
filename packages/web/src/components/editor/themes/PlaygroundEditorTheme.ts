/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './PlaygroundEditorTheme.css'
import type { EditorThemeClasses } from 'lexical'

const theme: EditorThemeClasses = {
  root: 'h-auto outline-none prose [&_*]:text-foreground',
  link: 'cursor-pointer',
  text: {
    base: 'font-normal',
    bold: 'font-semibold',
    underline: 'underline',
    italic: 'italic',
    strikethrough: 'line-through',
  },
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

  // replace all of these (eventually)
  blockCursor: 'PlaygroundEditorTheme__blockCursor',
  characterLimit: 'PlaygroundEditorTheme__characterLimit',
  code: 'PlaygroundEditorTheme__code',
  codeHighlight: {
    atrule: 'PlaygroundEditorTheme__tokenAttr',
    attr: 'PlaygroundEditorTheme__tokenAttr',
    boolean: 'PlaygroundEditorTheme__tokenProperty',
    builtin: 'PlaygroundEditorTheme__tokenSelector',
    cdata: 'PlaygroundEditorTheme__tokenComment',
    char: 'PlaygroundEditorTheme__tokenSelector',
    class: 'PlaygroundEditorTheme__tokenFunction',
    'class-name': 'PlaygroundEditorTheme__tokenFunction',
    comment: 'PlaygroundEditorTheme__tokenComment',
    constant: 'PlaygroundEditorTheme__tokenProperty',
    deleted: 'PlaygroundEditorTheme__tokenProperty',
    doctype: 'PlaygroundEditorTheme__tokenComment',
    entity: 'PlaygroundEditorTheme__tokenOperator',
    function: 'PlaygroundEditorTheme__tokenFunction',
    important: 'PlaygroundEditorTheme__tokenVariable',
    inserted: 'PlaygroundEditorTheme__tokenSelector',
    keyword: 'PlaygroundEditorTheme__tokenAttr',
    namespace: 'PlaygroundEditorTheme__tokenVariable',
    number: 'PlaygroundEditorTheme__tokenProperty',
    operator: 'PlaygroundEditorTheme__tokenOperator',
    prolog: 'PlaygroundEditorTheme__tokenComment',
    property: 'PlaygroundEditorTheme__tokenProperty',
    punctuation: 'PlaygroundEditorTheme__tokenPunctuation',
    regex: 'PlaygroundEditorTheme__tokenVariable',
    selector: 'PlaygroundEditorTheme__tokenSelector',
    string: 'PlaygroundEditorTheme__tokenSelector',
    symbol: 'PlaygroundEditorTheme__tokenProperty',
    tag: 'PlaygroundEditorTheme__tokenProperty',
    url: 'PlaygroundEditorTheme__tokenOperator',
    variable: 'PlaygroundEditorTheme__tokenVariable',
  },
  embedBlock: {
    base: 'PlaygroundEditorTheme__embedBlock',
    focus: 'PlaygroundEditorTheme__embedBlockFocus',
  },
  hashtag: 'PlaygroundEditorTheme__hashtag',
  image: 'editor-image relative',
  indent: 'PlaygroundEditorTheme__indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'PlaygroundEditorTheme__layoutContaner',
  layoutItem: 'PlaygroundEditorTheme__layoutItem',
  ltr: 'text-left',
  mark: 'PlaygroundEditorTheme__mark',
  markOverlap: 'PlaygroundEditorTheme__markOverlap',
  rtl: 'text-right',
}

export default theme
