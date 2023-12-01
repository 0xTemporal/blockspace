import { Skeleton } from '@nextui-org/react';

export default function PostSkeleton() {
  return (
    <div className="container flex max-w-[65ch] flex-col gap-y-2 px-2 text-foreground sm:px-0">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="my-4 flex justify-between">
        <Skeleton />
      </div>
      <Skeleton className="mb-4" />
      <div className="prose [&>*]:text-foreground">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
