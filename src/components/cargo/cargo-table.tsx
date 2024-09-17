import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';

import { Pagination } from '../ui/pagination';
import { format } from 'date-fns';
import { CargoTableToolbar } from './cargo-table-toolbar';
import { TableRowPlaceholder } from '../shared/table-row-placeholder';
import { ActionItem } from '../shared/action-item';
import { deleteCargoItem } from '@/lib/cargo/cargo.actions';
import { ConfirmationModal } from '../shared/confirmation-modal';
import { TableActions } from '../account/table-actions';

interface CargoTableProps {
  cargoItems: {
    data: {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      isActive: boolean;
      unit: string;
      rate: string;
      totalCount: number;
    }[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function CargoTable({ cargoItems }: CargoTableProps) {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <CargoTableToolbar />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Unit</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created At
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Updated At
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargoItems.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={item.isActive ? 'default' : 'destructive'}>
                      {item.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.unit}
                  </TableCell>
                  <TableCell>€{parseFloat(item.rate).toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.createdAt), 'PPpp')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(item.updatedAt), 'PPpp')}
                  </TableCell>
                  <TableCell>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <ActionItem
                            label="Update"
                            href={`/${item.id}/update`}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <ConfirmationModal
                            action={deleteCargoItem.bind(null, item.id)}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                    <TableActions
                      id={item.id}
                      action={deleteCargoItem.bind(null, item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <strong>
            {(cargoItems.page - 1) * cargoItems.limit + 1}-
            {Math.min(
              cargoItems.page * cargoItems.limit,
              cargoItems.totalCount,
            )}
          </strong>{' '}
          of <strong>{cargoItems.totalCount}</strong> Admins
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Pagination
            page={cargoItems.page}
            totalPages={cargoItems.totalPages}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
