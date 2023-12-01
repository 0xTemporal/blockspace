import { Avatar, Card, Skeleton } from '@nextui-org/react';

export default function AuthorSkeleton() {
  return (
    <div>
      <div className="h-24 w-full animate-pulse bg-slate-300 transition-colors duration-500" />
      <Card className="container -mt-12 mb-6 flex min-h-[100px] items-center gap-y-4 p-4 text-center">
        <Skeleton className="flex h-12 w-12 rounded-full" />
        <Skeleton className="h-16 w-3/5 rounded-lg" />
      </Card>
      <div className="container px-8 xl:px-64">
        <div className="flex flex-col gap-y-4">
          {new Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
