'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { requestDeletion } from '@/lib/package/package.actions';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function PackageDeleteAction({
  packageId,
  isArchived,
}: {
  packageId: number;
  isArchived: boolean;
}) {
  async function handlePackageDelete(packageid: number, isArchived: boolean) {
    const result = await requestDeletion(packageid, isArchived);
    if (!result.success) {
      toast(result.message, {
        description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
        action: {
          label: 'Retry',
          onClick: () => handlePackageDelete(packageid, isArchived),
        },
      });
    }
    toast(result.message, {
      description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
      action: {
        label: 'Undo',
        onClick: () => handlePackageDelete(packageid, !isArchived),
      },
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full p-2 text-left text-sm">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handlePackageDelete(packageId, isArchived)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
