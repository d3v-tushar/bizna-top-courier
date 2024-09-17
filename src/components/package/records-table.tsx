'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { createLogRecord } from '@/hooks/use-log-record';
import { PackageLogForm, PackageLogRecords } from './package-log-form';
import { TableRowPlaceholder } from '../shared/table-row-placeholder';
import { useStore } from 'zustand';
import { format } from 'date-fns';

// Create a custom hook for InvoiceLog
export const LogRecordStore = createLogRecord<PackageLogRecords>();

export function RecordsTable() {
  const logRecords = useStore(LogRecordStore, (state) => state.logs);

  console.log(logRecords);

  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <PackageLogForm />
        {logRecords.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#PKG</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Label</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Updated at
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logRecords?.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{log.barcode}</TableCell>
                    <TableCell className="capitalize">
                      <Badge variant="outline">{log.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {log.label}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(log?.updatedAt), 'PPpp')}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRowPlaceholder
                  totalRows={10}
                  filledRows={logRecords?.length || 0}
                />
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-40 flex-1 items-center justify-center rounded-md border">
            <h2 className="font-medium">No Records</h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
