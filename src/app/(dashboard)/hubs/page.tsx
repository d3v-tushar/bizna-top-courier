import HubTable from '@/components/hub/hub-table';
import { getHubList } from '@/lib/hub/hub.query';
import { unstable_cache as NextCache } from 'next/cache';

export default async function HubsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query = '', page = '1' } = searchParams;
  const cachedHubList = NextCache(getHubList, ['hubList', query, page], {
    tags: ['hubList', query, page],
    revalidate: 600,
  });
  const hubList = await cachedHubList(query, Number(page));
  return <HubTable hubList={hubList} />;
}
