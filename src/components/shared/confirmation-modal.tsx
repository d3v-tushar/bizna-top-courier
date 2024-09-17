'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ActionState {
  success: boolean;
  message: string;
}

interface AdminDeleteActionProps {
  action: () => Promise<ActionState>;
  actionLabel?: string;
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConfirmationModal({
  action,
  actionLabel = 'Delete',
  open,
  setOpen,
}: AdminDeleteActionProps) {
  const [pending, startTransition] = useTransition();

  async function handleAction() {
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.success) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} disabled={pending}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
