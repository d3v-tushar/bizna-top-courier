import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

export default function PackageLoading() {
  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <TableToolbarSkeleton />
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
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-48 rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="text-sm text-muted-foreground">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="h-8 w-32 rounded bg-gray-200"></div>
        </div>
      </CardFooter>
    </Card>
  );
}

function TableToolbarSkeleton() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="h-8 w-48 rounded bg-gray-200"></div>
      <div className="h-8 w-32 rounded bg-gray-200"></div>
    </div>
  );
}
