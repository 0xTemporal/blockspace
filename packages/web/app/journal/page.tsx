import { redirect } from 'next/navigation'

import { Journal } from '@/src/components/journal'
import { auth } from '@/src/lib/auth'

export const runtime = 'edge'

export default async function JournalPage() {
  const session = await auth()

  if (!session) {
    // TODO add toast
    return redirect('/')
  }

  return <Journal />
}
