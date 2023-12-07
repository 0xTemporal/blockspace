import { redirect } from 'next/navigation'

import { Journal } from '@/src/components/journal'
import { getSession } from '@/src/lib/session'

export const runtime = 'edge'

export default async function JournalPage() {
  const session = await getSession()

  if (!session) {
    // TODO add toast
    return redirect('/')
  }

  return <Journal />
}
