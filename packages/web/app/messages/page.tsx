import { redirect } from 'next/navigation'

import { auth } from '@/src/lib/auth'
import { MessagesView } from '@/src/views/messages'

export default async function Messages() {
  const session = await auth()

  if (!session) {
    // TODO add toast
    return redirect('/')
  }

  return <MessagesView />
}
