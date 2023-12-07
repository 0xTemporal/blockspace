import React from 'react'
import ReactDOM from 'react-dom/client'

export const mint = ({ onClose }: { onClose: () => void }) => {
  ReactDOM.createRoot(document.querySelector('body') as HTMLElement).render(
    <React.StrictMode>
      <div>HELLO WORLD</div>
    </React.StrictMode>,
  )
}
