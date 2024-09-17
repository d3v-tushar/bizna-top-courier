import { Card, CardContent } from '@/components/ui/card';

import { PackageTableToolbar } from './package-table-toolbar';
import { Pagination } from '../ui/pagination';

import { verifySession } from '@/lib/auth/dal';
import { PackageTableAdmin } from './package-table-admin';
import { PackageTableAgent } from './package-table-agent';

export default async function PackageTable({ packages }: any) {
  const session = await verifySession();
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <PackageTableToolbar />
        <div className="rounded-md border">
          {session.role === 'ADMIN' ? (
            <PackageTableAdmin packages={packages.data} />
          ) : (
            <PackageTableAgent packages={packages.data} />
          )}
        </div>
        {packages.totalPages > 0 && (
          <div className="mt-4 flex items-center justify-end">
            <Pagination page={packages.page} totalPages={packages.totalPages} />
          </div>
        )}
      </CardContent>
      {/* <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter> */}
    </Card>
  );
}
