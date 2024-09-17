export default function FindHubSkeleton() {
  return (
    <div className="container flex animate-pulse flex-col gap-6 px-4 py-4 md:max-w-[64rem] md:py-12 lg:py-24">
      {/* Skeleton for the search bar */}
      <div className="mb-4 h-10 w-full rounded-md bg-gray-300"></div>

      {/* Skeleton for each hub card */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="grid grid-cols-2 gap-8">
            <div className="flex-1 space-y-2">
              <div className="h-6 rounded-md bg-gray-300"></div>
              <div className="h-4 w-3/4 rounded-md bg-gray-300"></div>
              <div className="h-4 w-1/2 rounded-md bg-gray-300"></div>
            </div>
            <div className="h-40 w-full rounded-md bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
