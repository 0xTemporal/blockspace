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
      images: 'https://pbs.twimg.com/profile_images/1725588229808889859/L6bOXam6_400x400.jpg',
    },
  }
}

export default async function AuthorPage() {
  return <AuthorView />
}
