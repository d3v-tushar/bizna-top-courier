import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import db from '@/lib/database';
import { z } from 'zod';
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
import { suspendUser } from '@/lib/user/user.actions';
import { verifySession } from '@/lib/auth/dal';
import { Search } from '@/components/shared/search';
import { RefreshButton } from '@/components/shared/refresh-button';

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

async function getUsers({
  query,
  page = 1,
  pageSize = 10,
}: {
  query?: string;
  page: number;
  pageSize: number;
}) {
  const session = await verifySession();
  if (!session)
    return {
      data: [],
      page,
      pageSize,
      totalElements: 0,
      totalPages: 0,
    };
  const data = await db.query.users.findMany({
    columns: { passwordHash: false, createdAt: false },
    where: (users, { or, ilike }) =>
      query
        ? or(
            ilike(users.firstName, `%${query}%`),
            ilike(users.lastName, `%${query}%`),
            ilike(users.email, `%${query}%`),
            ilike(users.phone, `%${query}%`),
          )
        : undefined,

    extras: (users, { sql }) => ({
      totalElements: sql<number>`count(*) over()`.as('total_count'),
    }),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  const totalElements = data[0]?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / pageSize);

  return {
    data,
    page,
    pageSize,
    totalElements,
    totalPages,
  };
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) {
  const { query, page, pageSize } = parseSearchParams(searchParams);
  const userList = await getUsers({ query, page, pageSize });

  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <div className="mb-4 flex items-center gap-2.5">
          <Search placeholder="Search..." />
          <RefreshButton />
        </div>
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
                <TableHead className="hidden md:table-cell">Role</TableHead>
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
                      <TableCell className="hidden md:table-cell">
                        {user.role}
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
                          <DropdownMenuContent
                            align="end"
                            className="flex flex-col"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <ActionItem
                                label="View"
                                href={`/${user.role.toLowerCase()}s/${user.id}`}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <ActionItem
                                label="Update"
                                href={`/${user.role.toLowerCase()}s/${user.id}/update`}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <form>
                                <Button
                                  formAction={suspendUser.bind(
                                    null,
                                    user.id,
                                    user.isActive,
                                  )}
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                              </form>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
