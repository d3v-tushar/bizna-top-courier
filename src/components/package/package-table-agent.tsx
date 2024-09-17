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
import { requestDeletion } from '@/lib/package/package.actions';
import { TableActions } from '../account/table-actions';

interface PackageTableAgentProps {
  packages: {
    id: number;
    barcode: string;
    status: 'in progress' | 'dispatched' | 'on air' | 'deliverd';
    label:
      | 'Received At Hub'
      | 'Dispatch For Main Store, Italy'
      | 'Received at Main Store, Italy'
      | 'Dispatch for Bangladesh (On Air)'
      | 'Received at Main Store, Dhaka'
      | 'Dispatch for Destination'
      | 'Delivered';
    totalAmount: string;
    createdAt: string;
  }[];
}

export function PackageTableAgent({ packages }: PackageTableAgentProps) {
  return (
    <>
      {packages.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#ID</TableHead>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Label</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
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
                  €{pkg.totalAmount}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(pkg.createdAt), 'EEE MMM dd yyyy hh:mm a')}
                </TableCell>
                <TableCell>
                  <TableActions
                    id={pkg.barcode}
                    action={requestDeletion.bind(null, pkg.id, true)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex h-40 flex-1 items-center justify-center rounded-md border">
          <h2 className="font-medium">No Data</h2>
        </div>
      )}
    </>
  );
}
