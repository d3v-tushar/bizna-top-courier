import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Pagination } from '../ui/pagination';
import { format } from 'date-fns';
import { HubTableToolbar } from './hub-table-toolbar';
import { deleteHub } from '@/lib/hub/hub.actions';
import { HubActions } from './hub-actions';

interface HubTableProps {
  hubList: {
    data: {
      hubs: {
        id: number;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        addressId: number;
        latitude: string;
        longitude: string;
      };
      address: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        addressLine1: string;
        addressLine2: string | null;
        union: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      } | null;
    }[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function HubTable({ hubList }: HubTableProps) {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <HubTableToolbar />
        {Array.isArray(hubList.data) && hubList.data.length > 0 ? (
          <div className="whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">#ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead className="hidden md:table-cell">State</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Postal Code
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created At
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hubList.data.map((hub) => (
                  <TableRow key={hub.hubs.id}>
                    <TableCell className="hidden font-medium md:table-cell">
                      #{hub.hubs.id}
                    </TableCell>
                    <TableCell className="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap md:w-auto">
                      {hub.hubs.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={hub.hubs.isActive ? 'default' : 'destructive'}
                      >
                        {hub.hubs.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {hub.address?.city || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {hub.address?.state || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {hub.address?.postalCode || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(hub.hubs.createdAt), 'PPpp')}
                    </TableCell>

                    <TableCell>
                      <HubActions
                        action={deleteHub.bind(null, hub.hubs.id)}
                        id={hub.hubs.id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-40 flex-1 items-center justify-center rounded-md border lg:h-64">
            <h2 className="font-medium">No Data</h2>
          </div>
        )}
      </CardContent>

      {hubList?.totalPages > 5 && (
        <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {(hubList.page - 1) * hubList.pageSize + 1}-
              {Math.min(hubList.page * hubList.pageSize, hubList.totalCount)}
            </strong>{' '}
            of <strong>{hubList.totalCount}</strong>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Pagination page={hubList.page} totalPages={hubList.totalPages} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
