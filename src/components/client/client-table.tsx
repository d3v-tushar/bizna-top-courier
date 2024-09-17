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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableRowPlaceholder } from '../shared/table-row-placeholder';
import { ClientTableToolbar } from './client-table-toolbar';
import { Fragment } from 'react';

interface ClientTableProps {
  userList: {
    data: {
      id: number;
      firstName: string;
      lastName: string;
      phone: string;
      imageUrl: string | null;
      email: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      totalCount: number;
    }[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export function ClientTable({ userList }: ClientTableProps) {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <ClientTableToolbar />
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
                  Updated at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.data.length > 0 ? (
                <Fragment>
                  {userList.data?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="size-10 rounded-md">
                          <AvatarImage
                            src={user?.imageUrl ? user.imageUrl : '#'}
                            alt="Avatar"
                          />
                          <AvatarFallback className="bg-transparent">
                            {user?.firstName[0]}
                            {user?.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(
                          new Date(user.updatedAt),
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-60 text-center text-base md:h-[400px]"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <strong>
            {(userList.page - 1) * userList.pageSize + 1}-
            {Math.min(userList.page * userList.pageSize, userList.totalCount)}
          </strong>{' '}
          of <strong>{userList.totalCount}</strong>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Pagination page={userList.page} totalPages={userList.totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
