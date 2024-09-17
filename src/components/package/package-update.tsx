'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageUpdateSchema } from '@/lib/package/package.validations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PACKAGE_LABEL, PACKAGE_STATUS } from '@/lib/package/package.constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { updatePackage } from '@/lib/package/package.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InterceptingModal } from '../shared/Intercepting-modal';

interface PackageUpdateProps {
  packageId: number;
  defaultValues: z.infer<typeof PackageUpdateSchema>;
}

export function PackageUpdate({
  packageId,
  defaultValues,
}: PackageUpdateProps) {
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof PackageUpdateSchema>>({
    resolver: zodResolver(PackageUpdateSchema),
    defaultValues,
    mode: 'onChange',
  });

  return (
    <InterceptingModal
      title="Update Package"
      description="Update package details"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            try {
              const result = await updatePackage(packageId, data);
              if (!result.success) {
                toast(result.message, {
                  description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
                });
              }
              toast(result.message, {
                description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
              });
            } catch (error) {
              toast('Something went wrong!', {
                description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
              });
            } finally {
              push('/packages');
            }
          })}
          className="space-y-4 px-4 md:px-1"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="capitalize">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PACKAGE_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="capitalize">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PACKAGE_LABEL.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {defaultValues.status === 'deliverd' &&
          defaultValues.label === 'Delivered' ? (
            <FormField
              control={form.control}
              name="deliveryCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Cost</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Delivery Cost"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <Button className="w-full" type="submit">
            Update Package
          </Button>
        </form>
      </Form>
    </InterceptingModal>
  );
}
