import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { Journal } from '@/src/components/journal';

export default async function JournalPage() {
  const session = await getServerSession();

  if (!session) {
    // TODO add toast
    return redirect('/');
  }

  return <Journal />;
}
