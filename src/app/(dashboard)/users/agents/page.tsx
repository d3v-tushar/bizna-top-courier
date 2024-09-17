import { UserTable } from '@/components/account/user-table';
import { deleteAgent } from '@/lib/user/user.actions';
import { getAgentList } from '@/lib/user/user.query';
import { z } from 'zod';
import { unstable_cache as NextCache } from 'next/cache';

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

const cachedAgentList = NextCache(getAgentList, ['agents'], {
  tags: ['agents'],
  revalidate: 600,
});

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query, page = 1 } = parseSearchParams(searchParams);
  const adminList = await cachedAgentList(query, page);

  return <UserTable userList={adminList} action={deleteAgent} />;
}
