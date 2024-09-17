'use client';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface PackageDeleteActionProps {
  approveAction: () => Promise<{ success: boolean; message: string }>;
  rejectAction: () => Promise<{ success: boolean; message: string }>;
}

export function PackageDeleteAction({
  approveAction,
  rejectAction,
}: PackageDeleteActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setOpen(true)}>
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOpen(true)}>
          Reject
        </DropdownMenuItem>
        <ConfirmationModal
          open={open}
          setOpen={setOpen}
          actionLabel="Approve"
          action={approveAction}
        />
        <ConfirmationModal
          open={open}
          setOpen={setOpen}
          actionLabel="Reject"
          action={rejectAction}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
