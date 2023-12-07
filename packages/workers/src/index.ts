import { mintCompressedNft } from './lib/mint'
import './modules/upload'
import { generateFilenameWithExtension } from './modules/upload'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Bindings = {
  R2_BUCKET: R2Bucket
  PUBLIC_BUCKET_URL: string
  HELIUS_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app
  .use('*', cors())
  .get('/', (c) => c.text('Hello Hono!'))
  .get('/upload/:key')
  .post('/upload', async (c) => {
    const { url: urlString } = await c.req.json()

    if (urlString === null) {
      return c.json({ error: 'missing url' }, { status: 400 })
    }

    const url = new URL(urlString.toString())
    const resp = await fetch(url)

    if (!resp.ok) {
      return c.json({ error: 'failed to fetch url' }, { status: 422 })
    }

    const contentType = resp.headers.get('Content-Type')
    const filename = generateFilenameWithExtension(contentType, url.pathname)

    const uploadedImage = await c.env.R2_BUCKET.put(filename, resp.body, {
      httpMetadata: {
        contentType: contentType?.toString(),
      },
      customMetadata: {
        uploader: 'aster',
        'source-ray': c.req.header('cf-ray')!,
        'source-url': url.toString(),
      },
    })

    const imageUrl = `https://${c.env.PUBLIC_BUCKET_URL}/${filename}`

    const minted = await mintCompressedNft({
      apiUrl: `https://mainnet.helius-rpc.com/?api-key=${c.env.HELIUS_API_KEY}`,
      params: {
        name: 'temporal',
        symbol: 'TMPRL',
        owner: '7iPoDrXP8hFAJgCheLV7AFHrgmAHj8Fgh1VTgZyeeJs6',
        description: 'quek',
        attributes: [
          {
            trait_type: 'quek',
            value: 'quek',
          },
          {
            trait_type: 'quek',
            value: 'quek',
          },
          {
            trait_type: 'quek',
            value: 'quek',
          },
          {
            trait_type: 'quek',
            value: 'quek',
          },
        ],
        imageUrl,
        externalUrl: 'https://blockspace.so',
      },
    })

    return c.json({ imageUrl, minted })
  })

export default app

const s = {
  address: '4PGQiaX4ozpzhFkzeJz3ocDnj6JmDG3yN9TYHnQFTPJq',
  attributes: [
    {
      trait_type: 'quek',
      value: 'quek',
    },
    {
      trait_type: 'quek',
      value: 'quek',
    },
    {
      trait_type: 'quek',
      value: 'quek',
    },
    {
      trait_type: 'quek',
      value: 'quek',
    },
  ],
  collectionKey: '',
  creators: [],
  delegate: '',
  description: 'quek',
  image: 'cdn.blockspace.so/ir3ey6x.jpeg',
  name: 'temporal',
  owner: '7iPoDrXP8hFAJgCheLV7AFHrgmAHj8Fgh1VTgZyeeJs6',
  sellerFeeBasisPoints: 6900,
  frozen: false,
  mutable: false,
  compressed: true,
  dataHash: '5bmpoftpJw7nmWhKqckfKsfaZ4wfDtSzqPRAAwFn5Po9',
  creatorHash: 'EKDHSGbrGztomDfuiV4iqiZ6LschDJPsFiXjZ83f92Md',
  assetHash: 'HymyUJLiCfPc18WWs5Xayo9ucfGESxwovcaNqo5FkLZ6',
  tree: '5TYT7EAzT9XszzAo4ki6wKhzk3Zu4RJobt5ioV76yKrn',
  seq: 106927,
  leafId: 98438,
}
