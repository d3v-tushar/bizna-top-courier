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
import { AdminTableToolbar } from './admin-table-toolbar';
import Image from 'next/image';
import { TableRowPlaceholder } from '../shared/table-row-placeholder';
import { AdminDeleteAction } from './admin-delete';
import { deleteAdmin, updateUser } from '@/lib/user/user.actions';
import Link from 'next/link';
import { AdminActionForm } from './admin-update';
import { UserForm } from '../account/user-form';
import { UserTable } from '../account/user-table';

interface AdminTableProps {
  adminList: {
    data: {
      id: number;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      passwordHash: string;
      imageUrl: string | null;
      role: 'ADMIN' | 'AGENT' | 'CLIENT';
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      admin: {
        id: number;
      };
    }[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export function AdminTable({ adminList }: AdminTableProps) {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <AdminTableToolbar />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminList.data?.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={`${admin.firstName}'s Image`}
                      className="aspect-square rounded-md object-cover"
                      src={
                        admin?.imageUrl ||
                        `https://ui-avatars.com/api/?name=${admin.firstName}+${admin.lastName}&format=png`
                      }
                      height="40"
                      width="40"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {admin.firstName} {admin.lastName}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {admin.email}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {admin.phone}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {format(
                      new Date(admin.updatedAt),
                      'EEE MMM dd yyyy hh:mm a',
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
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
                          <Link href={`/users/admins/${admin.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/admins/${admin.id}/update`}>
                            Update
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <AdminDeleteAction
                            action={deleteAdmin.bind(null, admin.id)}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              <TableRowPlaceholder
                totalRows={10}
                filledRows={adminList.data?.length}
              />
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <strong>
            {(adminList.page - 1) * adminList.limit + 1}-
            {Math.min(adminList.page * adminList.limit, adminList.totalCount)}
          </strong>{' '}
          of <strong>{adminList.totalCount}</strong> Admins
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Pagination page={adminList.page} totalPages={adminList.totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
