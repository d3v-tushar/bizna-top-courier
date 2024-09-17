'use client';

import { X } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { cargoFormSchema } from '@/lib/cargo/cargo.validations';

interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} aria-disabled={pending} type="submit">
      {pending ? <LoadingDots /> : 'Save'}
    </Button>
  );
}

export default function CargoForm({
  defaultValues,
  action,
}: {
  defaultValues?: z.infer<typeof cargoFormSchema>;
  action: (
    formState: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(action, undefined);
  const form = useForm<z.infer<typeof cargoFormSchema>>({
    resolver: zodResolver(cargoFormSchema),
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
          className="flex w-full flex-col gap-4 overflow-visible p-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input className="h-9" placeholder="Document" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Envelopes, letters, and small packages"
                    rows={2}
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
                    {...field}
                    value={
                      field?.value ? (field.value ? 'true' : 'false') : 'true'
                    }
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                    name="isActive"
                    aria-label="status"
                    className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="true">Active</option>
                    <option value="false">Draft</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit*</FormLabel>
                <FormControl>
                  <Input className="h-9" placeholder="Pound, lb.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate*</FormLabel>
                <FormControl>
                  <Input className="h-9" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-auto grid w-full max-w-[400px]">
            <SubmitButton />
          </div>
        </form>
      </Form>
    </section>
  );
}
