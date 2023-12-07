import React from 'react'
import ReactDOM from 'react-dom/client'
import { MintUI } from './mint'

chrome.runtime.onMessage.addListener((message, sender, response) => {
  const { type, url } = message

  chrome.storage.sync.set({ url })
  if (type === 'MINT') {
    let div = window.document.body.querySelector('#blockspace-ext')
    let root: ReactDOM.Root | null = null

    if (!div) {
      div = window.document.createElement('div')
      div.id = 'blockspace-ext'
      window.document.body.prepend(div)

      const handleClose = () => {
        div?.remove()
      }
    }

    if (!root) {
      root = ReactDOM.createRoot(div)
    }

    // const image = window.document.body.querySelector(`[src=${url}]`)
    // console.log('image', image)

    const handleClose = () => {
      div?.remove()
    }

    root.render(
      <React.StrictMode>
        <MintUI onClose={handleClose} />
      </React.StrictMode>,
    )
  }
})
