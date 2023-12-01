'use client';

import { ColorBar } from './color-bar';
import { Avatar, Link, Tooltip } from '@nextui-org/react';
import { BsTwitterX } from 'react-icons/bs';
import { LuCake, LuKeyRound } from 'react-icons/lu';

export type AuthorProps = {
  author: string;
  avatar: string;
};

export const Author = ({ avatar, author }: AuthorProps) => {
  return (
    <div className="flex gap-x-2">
      <Tooltip
        classNames={{ content: 'p-0' }}
        content={
          <div className="mb-2">
            <ColorBar avatar={avatar} size="sm" className="rounded-t-md" />
            <div className="flex w-[300px] flex-col gap-y-1 px-4 py-1">
              <div className="flex">
                <Avatar src={avatar} size="sm" className="-mt-4" />
                <div className="flex flex-col gap-y-1 text-xs">
                  <Link href={`/${author}`} className="ml-1 w-fit text-sm font-medium" color="foreground">
                    {author}
                  </Link>
                  <span className="-ml-8 flex items-center gap-x-1">
                    <LuCake /> Joined on Jan 11, 2020
                  </span>
                </div>
              </div>
              <span>
                Wartime OSS maintainer. Co-founder of Solana Labs. Follows, retweets, likes are not endorsements. NFA,
                mostly technical gibberish. Be kind! toly@sollinked.com
              </span>
              <div className="flex flex-col gap-y-1 text-foreground/50">
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
            </div>
          </div>
        }
        placement="bottom"
      >
        <Avatar src={avatar} />
      </Tooltip>

      <span className="flex flex-col gap-y-1 text-xs">
        <Link href={`/${author}`} className="text-sm font-medium" color="foreground">
          {author}
        </Link>

        <span className="text-foreground/60">Today</span>
      </span>
    </div>
  );
};
