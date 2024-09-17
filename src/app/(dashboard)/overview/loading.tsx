import { Skeleton } from '@/components/ui/skeleton';

export default function OverviewSkeleton() {
  return (
    <section className="mt-4 space-y-6 text-gray-900">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
          >
            <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-500" />
            <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-500" />
            <Skeleton className="h-4 w-40 bg-gray-200 dark:bg-gray-500" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
          <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-500" />
          <div className="relative h-64">
            <Skeleton className="absolute inset-x-0 bottom-0 h-48 bg-gray-200 dark:bg-gray-500" />
            <Skeleton className="absolute inset-x-8 bottom-0 h-32 bg-gray-200 dark:bg-gray-500" />
            <Skeleton className="absolute inset-x-16 bottom-0 h-16 bg-gray-200 dark:bg-gray-500" />
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
          <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-500" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-500" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-500" />
                <Skeleton className="h-3 w-3/4 bg-gray-200 dark:bg-gray-500" />
              </div>
              <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
