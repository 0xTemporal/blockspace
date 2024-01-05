import { Author } from './author'
import { Link } from '@nextui-org/react'
import { LuDot } from 'react-icons/lu'

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
      <span className="flex gap-x-1 text-xs text-foreground/60 items-center">
        <p>2nd January, 2024</p>
        <LuDot aria-hidden />
        <p>4 minute read</p>
      </span>
    </div>
  )
}
