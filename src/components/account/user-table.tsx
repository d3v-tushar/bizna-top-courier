import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Fragment } from 'react';
import { ActionItem } from '@/components/shared/action-item';
import { TableToolbar } from '@/components/account/table-toolbar';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { TableActions } from './table-actions';

interface UserTableProps {
  userList: {
    data: {
      id: number;
      firstName: string;
      lastName: string;
      phone: string;
      imageUrl: string | null;
      email: string;
      role?: 'ADMIN' | 'AGENT' | 'CLIENT';
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      totalElements: number;
    }[];
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
  action: (id: number) => Promise<{
    success: boolean;
    message: string;
  }>;
}

export function UserTable({ userList, action }: UserTableProps) {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <TableToolbar />
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
                        <Badge variant={user.isActive ? 'default' : 'outline'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(new Date(user.updatedAt), 'PPpp')}
                      </TableCell>
                      <TableCell>
                        <TableActions
                          id={user.id}
                          action={action.bind(null, user.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="bg-muted/50 text-right text-xs"
                    >
                      Last Updated: {format(new Date(), 'PPpp')}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
            {Math.min(
              userList.page * userList.pageSize,
              userList.totalElements,
            )}
          </strong>{' '}
          of <strong>{userList.totalElements}</strong>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Pagination page={userList.page} totalPages={userList.totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
