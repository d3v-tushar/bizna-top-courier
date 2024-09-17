'use client';

import { X } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoadingDots } from '@/components/shared/loading-dots';
import { HubFormSchema } from '@/lib/hub/hub.validations';

interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
}

function SubmitButton({ isLoading }: { isLoading?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || isLoading}
      aria-disabled={pending || isLoading}
      type="submit"
    >
      {pending || isLoading ? <LoadingDots /> : 'Save'}
    </Button>
  );
}

export default function HubForm({
  defaultValues,
  action,
}: {
  defaultValues?: z.infer<typeof HubFormSchema>;
  action: (
    formState: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(action, undefined);
  const form = useForm<z.infer<typeof HubFormSchema>>({
    resolver: zodResolver(HubFormSchema),
    defaultValues: {
      ...defaultValues,
      ...(state?.fields ?? {}),
    },
  });

  return (
    <section>
      {state?.message !== '' && !state?.issues && (
        <p className="text-sm text-red-500" aria-live="polite">
          {state?.message}
        </p>
      )}
      {state?.issues && (
        <div className="text-sm text-red-500">
          <ul>
            {state?.issues.map((issue) => (
              <li key={issue} className="flex gap-1">
                <X className="size-4" fill="red" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={(evt) => {
            evt.preventDefault();
            form.handleSubmit(() => {
              formAction(new FormData(formRef.current!));
            })(evt);
          }}
          autoComplete="off"
          className="flex w-full flex-col gap-y-8 overflow-visible p-1"
        >
          <fieldset className="flex flex-col gap-y-6">
            <div className="mb-1.5 border-b pb-2">
              <legend className="font-semibold">Hub Information</legend>
              <span className="text-xs md:text-sm">
                Enter Hub Information Below
              </span>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="South Baridhara Hub"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      defaultValue={field?.value ? 'true' : 'false'}
                      onChange={(e) => field.onChange(e.target.value)}
                      name="isActive"
                      aria-label="status"
                      className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude*</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude*</FormLabel>
                  <FormControl>
                    <Input className="h-9" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-6">
            <div className="mb-1.5 border-b pb-2">
              <legend className="font-semibold">Address Information</legend>
              <span className="text-xs md:text-sm">
                Enter Hub Address Information
              </span>
            </div>
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street address or P.O. Box"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apt, suite, unit, building, floor, etc."
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="union"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Union/ Community</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <div className="ml-auto grid w-full max-w-[400px]">
            {/* <SubmitButton isLoading={form.formState.isSubmitting} /> */}
            <Button
              disabled={form.formState.isSubmitting}
              aria-disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState?.isSubmitting ? <LoadingDots /> : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
