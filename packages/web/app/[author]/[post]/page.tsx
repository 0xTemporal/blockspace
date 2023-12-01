import { Metadata } from 'next';

import { PostView } from '@/src/views/post';

const truncateAddress = (address: string, charCount: number = 6) =>
  `${address.slice(0, charCount)}...${address.slice(-charCount)}`;

export async function generateMetadata({ params }): Promise<Metadata> {
  const author = params.author;

  return {
    title: 'Hello world?????',

    description: 'test desc.',
    authors: { name: author },
    openGraph: {
      type: 'profile',
      username: 'toly',
      images: 'https://pbs.twimg.com/profile_images/1725588229808889859/L6bOXam6_400x400.jpg',
    },
  };
}

export default function PostPage({ params }: any) {
  return <PostView />;
}
