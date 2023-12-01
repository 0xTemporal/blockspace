import { Avatar, Card, Skeleton } from '@nextui-org/react';

export default function JournalSkeleton() {
  return (
    <div className="container max-w-[68ch] space-y-8">
      <Skeleton className="mt-4 flex h-10 w-full rounded-full" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}
