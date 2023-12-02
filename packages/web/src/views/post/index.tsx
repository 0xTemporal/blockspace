'use client'

import { trpc } from '@/app/_trpc/client'
import { Image, Link } from '@nextui-org/react'
import Markdown from 'react-markdown'

import { Author } from '@/src/components/author'
import { MintableBlock } from '@/src/components/mintable-block'
import { PostDropdown } from '@/src/components/post-dropdown'
import { useEditorState, useUserStore } from '@/src/state'

export function PostView() {
  const author = 'toly'

  const { data } = trpc.user.getUsers.useQuery()
  const { user } = useUserStore()

  const { md } = useEditorState()

  return (
    <div className="container flex max-w-[65ch] flex-col gap-y-2 px-2 text-foreground sm:px-0">
      <Image src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg" alt="hero image" />
      <div className="mx-2 my-4 flex justify-between">
        <Author author={author} avatar={user?.avatar ?? ''} />
        <PostDropdown />
      </div>
      <h1 className="mx-2 mb-4 text-4xl font-semibold text-foreground">This is the Title for this Post</h1>
      <div className="prose [&>*]:text-foreground">
        <Markdown
          components={{
            a: ({ href, children }) => (
              <Link href={href} target="_blank" className="inline">
                {children}
              </Link>
            ),
            p: MintableBlock,
          }}
        >
          {md}
        </Markdown>
      </div>
    </div>
  )
}
