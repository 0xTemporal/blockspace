import { redirect } from 'next/navigation'

import { getSession } from '@/src/lib/session'
import { MessagesView } from '@/src/views/messages'

export const runtime = 'edge'

export default async function Messages() {
  const session = await getSession()

  if (!session) {
    // TODO add toast
    return redirect('/')
  }

  return <MessagesView />
}
