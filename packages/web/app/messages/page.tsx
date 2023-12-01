import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { MessagesView } from '@/src/views/messages';

export default async function Messages() {
  const session = await getServerSession();

  if (!session) {
    // TODO add toast
    return redirect('/');
  }

  return <MessagesView />;
}
