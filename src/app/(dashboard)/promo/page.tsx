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
import { TableRowPlaceholder } from '@/components/shared/table-row-placeholder';
import { Pagination } from '@/components/ui/pagination';
import db from '@/lib/database';
import { format } from 'date-fns';
import { PromoForm } from '@/components/promo/promo-form';

async function getPromoCodes(query: string = '') {
  return await db.query.coupons.findMany({
    where: (coupon, { ilike }) =>
      query ? ilike(coupon.name, `%${query}%`) : undefined,
  });
}

export default async function PromoPage() {
  const promoCodes = await getPromoCodes();
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <div className="mb-2 ml-auto flex w-full items-center justify-between">
          <h3 className="text-sm font-medium">
            Under Construction (Might have modified for maximum value)
          </h3>
          <PromoForm />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">#ID</span>
                </TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Expired at
                </TableHead>
                {/* <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes?.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>#{promo.id}</TableCell>
                  <TableCell className="font-medium">{promo.name}</TableCell>

                  <TableCell>{parseInt(promo.value)}%</TableCell>

                  <TableCell className="hidden md:table-cell">
                    {format(new Date(promo.createdAt), 'yyyy-MM-dd hh:mm a')}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {format(new Date(promo?.expiredAt), 'yyyy-MM-dd hh:mm a')}
                  </TableCell>

                  {/* <TableCell>
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
                  </TableCell> */}
                </TableRow>
              ))}

              <TableRowPlaceholder
                totalRows={10}
                filledRows={promoCodes?.length || 0}
              />
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="mt-4 flex items-center justify-end">
          <Pagination page={1} totalPages={1} />
        </div>
      </CardFooter>
    </Card>
  );
}
