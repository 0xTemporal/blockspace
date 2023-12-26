/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Input } from '@nextui-org/react'
import * as React from 'react'

type Props = Readonly<{
  'data-test-id'?: string
  accept?: string
  label: string
  onChange: (files: FileList | null) => void
}>

export default function FileInput({ accept, label, onChange, 'data-test-id': dataTestId }: Props): JSX.Element {
  return (
    <div className="space-x-2 mb-2">
      <label className="Input__label">{label}</label>
      <input type="file" accept={accept} onChange={(e) => onChange(e.target.files)} data-test-id={dataTestId} />
    </div>
  )
}
