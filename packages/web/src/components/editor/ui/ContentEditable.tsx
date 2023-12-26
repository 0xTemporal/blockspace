/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import * as React from 'react'

export default function LexicalContentEditable({ className }: { className?: string }): JSX.Element {
  return (
    <ContentEditable className={`border-0 prose block relative outline-0 pt-4 px-7 pb-8 min-h-[150px] ${className}`} />
  )
}
