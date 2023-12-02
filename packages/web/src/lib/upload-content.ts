import Irys from '@irys/sdk'
import { WalletContextState } from '@solana/wallet-adapter-react'
import crypto from 'crypto'
import toast from 'react-hot-toast'
import slugify from 'slugify'

export interface ContentPayload {
  title: string
  image_url: string
  description: string
  content: string
  type: string
}

export const uploadContent = async (
  data: ContentPayload,
  wallet: WalletContextState,
  postAccount: string,
  profileAccount: string,
  parentDigest?: string,
) => {
  if (!wallet.signMessage) {
    toast.error('Sorry, your wallet does not support message signature')
    return
  }

  if (!wallet.publicKey) return

  const contentDigest = crypto.createHash('sha256').update(JSON.stringify(data.content)).digest().toString('hex')

  const contentSignature = await wallet.signMessage(new TextEncoder().encode(contentDigest))
  if (!contentSignature) return
  const contentSignatureString = Buffer.from(contentSignature).toString('base64')

  let mut_slug = ''

  const { title, image_url, description } = data
  if (title) mut_slug = title
  if (!title) mut_slug = 'Untitled Article ' + Date.now()

  const sanitizedSlug = slugify(mut_slug, {
    lower: true,
    remove: /[^A-Za-z0-9\s]/g,
  })

  const finalData = {
    ...data,
    slug: sanitizedSlug,
    title: title || 'Untitled Article',
    image_url: image_url || '',
    description: description || '',
    authorship: {
      signature: contentSignatureString,
      publicKey: wallet.publicKey.toBase58(),
    },
    contentDigest,
    signatureEncoding: 'base64',
    digestEncoding: 'hex',
    parentDigest: parentDigest || '',
  }

  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Content-Digest', value: contentDigest },
    { name: 'App-Name', value: 'Wordcel' },
    { name: 'Author', value: wallet.publicKey.toBase58() },
    { name: 'Title', value: title || 'Untitled Article' },
    { name: 'Slug', value: sanitizedSlug },
    { name: 'Description', value: description || '' },
    { name: 'Image-URL', value: image_url || '' },
    { name: 'Publish-Date', value: new Date().getTime().toString() },
    { name: 'Profile Account', value: profileAccount },
    { name: 'Post Account', value: postAccount },
    { name: 'Parent Digest', value: parentDigest || '' },
  ]

  const userSignature = await wallet.signMessage(new Uint8Array(3))
  if (!userSignature) return

  const irys = new Irys({
    url: 'https://devnet.irys.xyz',
    token: 'sol',
    key: '',
    config: { providerUrl: process.env.HELIUS_API_URL },
  })

  const uploaded = await irys.upload('', {})

  const success = await uploaded.verify()

  return success
}
