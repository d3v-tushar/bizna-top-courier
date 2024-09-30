'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PACKAGE_LABEL, PACKAGE_STATUS } from '@/lib/package/package.constants';
import { PackageLogSchema } from '@/lib/package/package.validations';
import { updatePackageByBarcode } from '@/lib/package/package.actions';
import { toast } from 'sonner';
import { format, sub } from 'date-fns';

import { LogRecordStore } from './records-table';
import { useStore } from 'zustand';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

export type PackageLogRecords = z.infer<typeof PackageLogSchema>;

type UpdatePackageResult =
  | { success: false; message: string; data?: undefined }
  | {
      success: true;
      message: string;
      data: {
        barcode: string;
        status: 'in progress' | 'dispatched' | 'on air' | 'delivered';
        label:
          | 'Received At Hub'
          | 'Dispatched'
          | 'On Air'
          | 'Delivered'
          | 'In Progress'
          | 'At Destination';
        id: number;
        createdAt: Date;
        updatedAt: Date;
      };
    };

export function PackageLogForm() {
  const [logs, dispatch, reset] = useStore(LogRecordStore, (state) => [
    state.logs,
    state.addLog,
    state.resetLogs,
  ]);

  const form = useForm<PackageLogRecords>({
    resolver: zodResolver(PackageLogSchema),
    defaultValues: {
      barcode: '',
      // status: 'in progress',
      // label: 'Received At Hub',
    },
  });

  const onSubmit = async (data: PackageLogRecords) => {
    const isExisting = logs.some(
      (log) =>
        log.barcode === data.barcode &&
        log.status === data.status &&
        log.label === data.label,
    );

    if (isExisting) {
      toast.warning('Package Already Exists in Records!');
      return;
    }

    try {
      const result = await updatePackageByBarcode(data);

      if (result.success && result.data) {
        dispatch(result.data as PackageLogRecords);
        form.reset({ barcode: '', status: data.status, label: data.label });
        toast.success(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(
        `${data.barcode} Update Failed! ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  // const handleBarcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   form.setValue('barcode', e.target.value);
  //   if (e.target.value.length >= 10) {
  //     form.handleSubmit(onSubmit)();
  //   }
  // };

  const handleBarcodeInput = () => {
    form.handleSubmit(onSubmit);
  };

  console.log('log from state', form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 grid w-full grid-cols-1 items-center gap-2 text-sm md:grid-cols-5"
      >
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Barcode</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyUp={() => handleBarcodeInput}
                  autoFocus
                  placeholder="BTXXXXXXXX"
                  className="h-8"
                  readOnly={form.formState.isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Label</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select a label" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_LABEL.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="col-span-1 flex items-center justify-between md:grid-cols-2 md:justify-center">
          <Button
            disabled={
              form.formState.isSubmitting ||
              Object.keys(form.formState.errors).length > 0
            }
            className="mt-2 h-8"
            type="submit"
          >
            Update
          </Button>

          <Button
            size="sm"
            className="ml-auto mt-2 flex h-8 items-center gap-2"
            onClick={reset}
            aria-label="reset logs"
            variant="outline"
          >
            <ReloadIcon className="size-4" />
            <span>Reset Logs</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
