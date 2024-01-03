import { Metadata } from 'next'

import { db } from '@/src/db'
import { AuthorView } from '@/src/views/author'

export const runtime = 'edge'

type Props = {
  params: { author: string }
}

export async function generateMetadata({ params }: Props) {
  const author = params.author

  return {
    title: 'Hello world',
    description: 'test desc.',
    authors: { name: author },
    openGraph: {
      type: 'profile',
      username: 'toly',
      images: '',
    },
  } as Metadata
}

export default async function AuthorPage({ params }: Props) {
  // TODO: fetch author data from db
  const author = await (() => {
    return { name: params.author }
  })()

  if (!author) {
    // TODO: 404
    return <div>404</div>
  }

  return <AuthorView author={author} />
}
