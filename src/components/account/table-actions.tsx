'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ConfirmationModal = dynamic(
  () =>
    import('@/components/shared/confirmation-modal').then(
      (mod) => mod.ConfirmationModal,
    ),
  {
    ssr: false,
  },
);

interface TableActionsProps {
  id: number | string;
  action: () => Promise<{
    success: boolean;
    message: string;
  }>;
}

export function TableActions({ id, action }: TableActionsProps) {
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
      <DropdownMenuContent align="end" className="flex flex-col">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => push(pathname + `/${id}`)}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => push(pathname + `/${id}/update`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOpen(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ConfirmationModal action={action} open={open} setOpen={setOpen} />
    </DropdownMenu>
  );
}
