import { Author } from './author'
import { ColorBar } from './color-bar'
import { Avatar, Link, Tooltip } from '@nextui-org/react'
import { BsTwitterX } from 'react-icons/bs'
import { LuCake, LuKeyRound } from 'react-icons/lu'

export type PostPreviewProps = {
  author: string
  avatar: string
}

export const PostPreview = ({ avatar, author }: PostPreviewProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <Author author={author} avatar={avatar} />
      <Link href={`/${author}/123`} className="w-fit text-xl font-bold" color="foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Link>
      <p className="">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed convallis est libero, eget egestas odio dignissim
        vitae.
      </p>
      <p className="text-xs text-foreground/60">4 minute read</p>
    </div>
  )
}
