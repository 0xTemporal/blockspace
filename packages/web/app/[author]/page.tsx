import { Avatar, Card, Divider } from '@nextui-org/react'
import { Metadata } from 'next'
import { BsTwitterX } from 'react-icons/bs'
import { LuCake, LuKeyRound } from 'react-icons/lu'

import { AuthorView } from '@/src/views/author'

export const runtime = 'edge'

type Props = {
  params: { author: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  }
}

export default async function AuthorPage() {
  return <AuthorView />
}
