import { UserTable } from '@/components/account/user-table';
import { deleteAdmin } from '@/lib/user/user.actions';
import { getAdminList } from '@/lib/user/user.query';
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

const cachedAdminList = NextCache(getAdminList, ['admins'], {
  tags: ['admins'],
  revalidate: 600,
});

export default async function AdminsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query, page, pageSize } = parseSearchParams(searchParams);
  const adminList = await cachedAdminList(query, page, pageSize);

  return <UserTable userList={adminList} action={deleteAdmin} />;
}
