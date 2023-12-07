// console.log('background is running')

import { mint } from './mint'

// chrome.runtime.onMessage.addListener((request) => {
//   if (request.type === 'COUNT') {
//     console.log('background has received a message from popup, and count is ', request?.count)
//   }
// })

const menu = chrome.contextMenus.create({
  title: 'Mint to Wallet',
  id: 'mint-to-wallet',
  contexts: ['image'],
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'MINT', url: info.srcUrl })
  }
  // try {
  //   const response = await fetch('http://localhost:8787/upload', {
  //     method: 'POST',
  //     body: JSON.stringify({ url: info.srcUrl }),
  //   })
  //   console.log(await response.json())
  // } catch (e) {
  //   console.log(e)
  // }
})
