'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ConfirmationModal } from '../shared/confirmation-modal';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface HubActionsProps {
  id: number | string;
  action: () => Promise<{
    success: boolean;
    message: string;
  }>;
}

export function HubActions({ action, id }: HubActionsProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { push } = useRouter();
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
        <DropdownMenuItem onSelect={() => push(pathname + `/${id}/edit`)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOpen(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ConfirmationModal action={action} open={open} setOpen={setOpen} />
    </DropdownMenu>
  );
}
