'use client'

import { Avatar, Card, Divider } from '@nextui-org/react'
import { BsTwitterX } from 'react-icons/bs'
import { LuCake, LuKeyRound } from 'react-icons/lu'

import { ColorBar } from '@/src/components/color-bar'
import { PostPreview } from '@/src/components/post-preview'

export function AuthorView() {
  const author = 'toly'
  const avatar = 'https://pbs.twimg.com/profile_images/1725588229808889859/L6bOXam6_400x400.jpg'
  const posts = new Array(8).fill(0)

  return (
    <div className="flex flex-col gap-y-4">
      <ColorBar avatar={avatar} />
      <Card className="container -mt-16 mb-6 flex min-h-[100px] items-center gap-y-2 p-4 text-center">
        <Avatar size="lg" src={avatar} />
        <h1 className="text-2xl font-semibold">{author}</h1>
        <p className="w-3/ sm:w-1/2">
          Wartime OSS maintainer. Co-founder of Solana Labs. Follows, retweets, likes are not endorsements. NFA, mostly
          technical gibberish. Be kind! toly@sollinked.com
        </p>
        <div className="flex items-center gap-x-4 gap-y-2 text-sm text-foreground/50">
          <span className="flex items-center gap-x-1">
            <LuCake /> Joined on Jan 11, 2020
          </span>
          <a
            className="flex items-center gap-x-1 hover:text-foreground"
            href="https://x.com/aeyakovenko"
            target="_blank"
          >
            <LuKeyRound /> toly.sol
          </a>
          <a
            className="flex items-center gap-x-1 hover:text-foreground"
            href="https://x.com/aeyakovenko"
            target="_blank"
          >
            <BsTwitterX /> @aeyakovenko
          </a>
        </div>
      </Card>
      <div className="container px-8 xl:px-64">
        <div className="flex flex-col gap-y-4">
          {posts.map((_, i) => (
            <div key={i}>
              {i > 0 ? <Divider /> : null}
              <PostPreview author={author} avatar={avatar} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
