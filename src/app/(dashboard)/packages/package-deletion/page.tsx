import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { format } from 'date-fns';
import db from '@/lib/database';
import { deletePackage, requestDeletion } from '@/lib/package/package.actions';
import { RefreshButton } from '@/components/shared/refresh-button';
import { BackButton } from '@/components/shared/back-button';
import { PackageDeleteAction } from './package-delete-action';

export const revalidate = 300; // 5 minutes

export default async function PackageDeletion() {
  const packages = await db.query.packages.findMany({
    columns: {
      id: true,
      barcode: true,
      status: true,
      label: true,
      totalAmount: true,
      createdAt: true,
      isArchived: true,
    },
    where: (pkg, { eq }) => eq(pkg.isArchived, true),
  });
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <BackButton />
          <RefreshButton />
        </div>
        {packages.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#ID</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Label</TableHead>
                  <TableHead className="hidden md:table-cell">Total</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages?.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell key={pkg.barcode} className="font-medium">
                      #{pkg.id}
                    </TableCell>
                    <TableCell key={pkg.barcode}>{pkg.barcode}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pkg.status}</Badge>
                    </TableCell>
                    <TableCell>{pkg.label}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${pkg.totalAmount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(pkg.createdAt), 'PPpp')}
                    </TableCell>
                    <TableCell>
                      <PackageDeleteAction
                        approveAction={deletePackage.bind(null, pkg.id)}
                        rejectAction={requestDeletion.bind(null, pkg.id, false)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-40 flex-1 items-center justify-center rounded-md border">
            <h2 className="font-medium">No Data</h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
