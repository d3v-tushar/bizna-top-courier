'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ResponsiveDialog } from '../shared/responsive-dialog';
import { useFormState, useFormStatus } from 'react-dom';
import { createCoupon } from '@/lib/coupon-promo/coupon.actions';
import { toast } from 'sonner';
import { format } from 'date-fns';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? 'Please Wait...' : ' Create'}
    </Button>
  );
}

export function PromoForm() {
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useFormState(createCoupon, undefined);

  useEffect(() => {
    if (state?.message === 'Promo created successfully!') {
      toast(state?.message, {
        description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
        icon: '🎉',
        duration: 5000,
      });
      setOpen(false);
    }
  }, [state?.message]);
  return (
    <ResponsiveDialog
      title="Create Promo"
      description="Enter Promo Value & Expiry"
      label="Create"
      open={open}
      setOpen={setOpen}
    >
      <form action={dispatch} className="flex flex-col gap-y-4 px-4 md:px-1">
        <div>
          {state?.message && (
            <p
              aria-live="polite"
              className="text-sm font-semibold capitalize text-gray-600 underline"
            >
              {state.message}
            </p>
          )}
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="code">Promo Code</Label>
            <Input id="code" placeholder="EID2025" name="name" required />
            {state?.errors?.name && (
              <span className="text-sm text-red-500">{state?.errors.name}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="promo-value">Value (Max 25%)</Label>
            <Input
              id="promo-value"
              placeholder="7%"
              name="value"
              type="number"
              max="25"
              required
            />
            {state?.errors?.value && (
              <span className="text-sm text-red-500">
                {state?.errors.value}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input
              id="expiry-date"
              name="expiredAt"
              type="date"
              className="flex w-full"
              required
            />
            {state?.errors?.expiredAt && (
              <span className="text-sm text-red-500">
                {state?.errors.expiredAt}
              </span>
            )}
          </div>
        </div>

        <SubmitButton />
      </form>
    </ResponsiveDialog>
  );
}
