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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination } from '../ui/pagination';
import { format } from 'date-fns';
import { TableRowPlaceholder } from '../shared/table-row-placeholder';
import { AgentTableToolbar } from './agent-table-toolbar';
import Link from 'next/link';
import { ConfirmationModal } from '../shared/confirmation-modal';
import { deleteAgent } from '@/lib/user/user.actions';
import { TableActions } from '../account/table-actions';

interface AdminTableProps {
  agentList: {
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

export function AgentTable({ agentList }: AdminTableProps) {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <AgentTableToolbar />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
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
              {agentList.data?.map((user) => (
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

                  <TableCell>{user.email}</TableCell>

                  <TableCell className="hidden md:table-cell">
                    {user.phone}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {format(
                      new Date(user.updatedAt),
                      'EEE MMM dd yyyy hh:mm a',
                    )}
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
                          <Link href={`/users/agents/${user.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/agents/${user.id}/update`}>
                            Update
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <ConfirmationModal
                            action={deleteAgent.bind(null, user.id)}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                    <TableActions
                      id={user.id}
                      action={deleteAgent.bind(null, user.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}

              <TableRowPlaceholder
                totalRows={10}
                filledRows={agentList.data?.length}
              />
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <strong>
            {(agentList.page - 1) * agentList.pageSize + 1}-
            {Math.min(
              agentList.page * agentList.pageSize,
              agentList.totalCount,
            )}
          </strong>{' '}
          of <strong>{agentList.totalCount}</strong> Agents
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Pagination page={agentList.page} totalPages={agentList.totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
