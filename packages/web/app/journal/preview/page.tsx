'use client'

import { Button, Image, Link } from '@nextui-org/react'
import { LuArrowLeft } from 'react-icons/lu'
import Markdown from 'react-markdown'

import { Author } from '@/src/components/author'
import { useEditorState } from '@/src/state'
import { useUserStore } from '@/src/state'

const truncateAddress = (address: string, charCount: number = 6) =>
  `${address.slice(0, charCount)}...${address.slice(-charCount)}`

export default function PostPage() {
  const author = 'toly'

  const { user } = useUserStore()

  const { md, state } = useEditorState()

  return (
    <div className="container flex max-w-[65ch] flex-col gap-y-2 px-2 text-foreground sm:px-0">
      <Image src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg" alt="hero image" />
      <div className="my-4">
        <Author author={author} avatar={user?.avatar ?? ''} />
      </div>
      <h1 className="mb-4 text-4xl font-semibold text-foreground">This is the Title for this Post</h1>
      <div className="prose [&>*]:text-foreground">
        <Markdown
          components={{
            a: ({ href, children }) => (
              <Link href={href} target="_blank" className="inline">
                {children}
              </Link>
            ),
          }}
        >
          {md}
        </Markdown>
      </div>
      <div className="fixed bottom-8 left-8 flex items-center gap-x-2">
        <Button as={Link} isIconOnly radius="full" href="/journal">
          <LuArrowLeft />
        </Button>
      </div>
    </div>
  )
}
