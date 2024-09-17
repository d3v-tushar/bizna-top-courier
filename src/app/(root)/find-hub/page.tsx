import { Search } from '@/components/shared/search';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { getHubListWithAgents } from '@/lib/hub/hub.query';
import { Card } from '@/components/ui/card';
import { z } from 'zod';
import { unstable_cache as NextCache } from 'next/cache';

export const metadata = {
  title: 'Find A Hub',
};

export const revalidate = 0; // 10 minutes

const PaginationSearchSchema = z.object({
  query: z.string().trim().optional().describe('Optional search query string'),
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1)
    .describe('The current page number'),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .describe('Number of items per page'),
});

function parseSearchParams(searchParams: {
  [key: string]: string | undefined;
}) {
  try {
    const parsedParams = PaginationSearchSchema.parse(searchParams);
    return parsedParams;
  } catch (error) {
    console.error('Invalid search parameters:', error);
    return {
      query: '',
      page: 1,
      pageSize: 10,
    }; // Return default values or handle as needed
  }
}

const getCachedHubs = NextCache(getHubListWithAgents, ['hubs'], {
  revalidate: 3600,
  tags: ['hubs'],
});

export default async function FindHubPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query, page } = parseSearchParams(searchParams);
  const hubList = await getCachedHubs(query, page);

  return (
    <section className="container flex flex-col gap-6 px-4 py-4 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full animate-fade-up flex-col gap-4 p-2">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Find Nearby Hub
        </h2>
        <p className="text-sm leading-normal text-muted-foreground md:text-lg md:leading-7">
          Looking for a nearby hub to send your packages? Simply enter your
          city, state, or zip code to find the nearest BiznaTop hub. Our team is
          here to assist you with any shipping needs.
        </p>
      </div>
      <div className="mx-auto mt-6 w-full space-y-4 overflow-x-auto p-2 md:max-w-[64rem]">
        <Search
          placeholder="Find by City, State, or Zip"
          className="mb-4 h-10 w-full lg:min-w-[400px]"
        />
        {hubList.data.length > 0 ? (
          <>
            {hubList.data.map((hub, idx) => (
              <Card
                key={idx}
                className="flex h-auto w-full items-center justify-between gap-2 rounded-lg border p-3 shadow-sm md:p-2"
              >
                <div className="h-full w-full space-y-2">
                  <h3 className="text-lg font-medium">{hub.hubName}</h3>
                  <address className="text-sm not-italic text-muted-foreground">
                    <p>{hub.addressLine1}</p>
                    {hub.city}, {hub.state}, {hub.postalCode}
                  </address>
                  <Separator className="w-full" />
                  <div className="mt-auto flex flex-col gap-1">
                    <div className="font-medium">{hub.agentName}</div>
                    <div className="text-sm text-muted-foreground">
                      Phone: {hub.agentPhone}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Email: {hub.agentEmail}
                    </div>
                  </div>
                  <Link
                    href={`https://www.google.com/maps?q=${hub.latitude},${hub.longitude}`}
                    target="_blanks"
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'sm' }),
                      'ml-auto flex items-center md:hidden',
                    )}
                  >
                    <MapPinIcon className="mr-1 size-4 text-muted-foreground" />
                    <span>View On Map</span>
                  </Link>
                </div>
                <iframe
                  src={`https://www.google.com/maps?q=${hub.latitude},${hub.longitude}&output=embed`}
                  width="100%"
                  height="100%"
                  allowFullScreen={false}
                  title="hub location"
                  className="hidden max-w-sm rounded-md border-none focus:outline-none md:block"
                />
              </Card>
            ))}
          </>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-md border border-gray-200 shadow-sm">
            <h2 className="text-center text-xl font-semibold text-muted-foreground">
              Opsss! No Results
            </h2>
          </div>
        )}
      </div>
      <div className="mx-auto mt-4 flex gap-2">
        <Link
          href={{
            pathname: '/find-hub',
            query: {
              query,
              page: hubList.page - 1 !== 0 ? hubList.page - 1 : hubList.page,
            },
          }}
          aria-disabled={hubList.page - 1 === 0}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-24 gap-1 pl-2.5',
          )}
        >
          <ChevronLeftIcon className="size-4" />
          <span>Previous</span>
        </Link>
        <Link
          href={{
            pathname: '/find-hub',
            query: {
              query,
              page: hubList.data.length !== 0 ? hubList.page + 1 : hubList.page,
            },
          }}
          aria-disabled={hubList.data.length === 0}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-24 gap-1 pl-2.5',
          )}
        >
          <span>Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mx-auto w-full p-2 md:max-w-[64rem]">
        <p className="text-justify leading-normal text-muted-foreground sm:leading-7">
          BiznaTop is committed to providing top-tier service for all your
          courier needs, ensuring your packages reach Bangladesh safely and on
          time. Whether you’re sending{' '}
          <strong> important documents or large parcels</strong>, our local hubs
          make the process simple and efficient..
        </p>
      </div>
    </section>
  );
}
