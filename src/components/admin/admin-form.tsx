'use client';

import { X } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AdminFormSchema } from '@/lib/user/user.validations';
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

export default function AdminForm({
  defaultValues,
  action,
}: {
  defaultValues?: z.infer<typeof AdminFormSchema>;
  action: (
    formState: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(action, undefined);
  const form = useForm<z.infer<typeof AdminFormSchema>>({
    resolver: zodResolver(
      defaultValues
        ? AdminFormSchema.omit({
            password: true,
          }).extend({
            password: z
              .string()
              .min(8, { message: 'Be at least 8 characters long' })
              .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
              .regex(/[0-9]/, { message: 'Contain at least one number.' })
              .regex(/[^a-zA-Z0-9]/, {
                message: 'Contain at least one special character.',
              })
              .trim()
              .optional()
              .or(z.literal('')),
          })
        : AdminFormSchema,
    ),
    defaultValues: {
      ...defaultValues,
      ...(state?.fields ?? {}),
    },
  });

  // useEffect(() => {
  //   if (form.formState.isSubmitSuccessful) {
  //     back();
  //   }
  // }, [form.formState.isSubmitSuccessful, back]);

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
          className="flex flex-col gap-4 overflow-visible p-1"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name*</FormLabel>
                  <FormControl>
                    <Input className="h-9" placeholder="Max" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name*</FormLabel>
                  <FormControl>
                    <Input className="h-9" placeholder="Robinson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone*</FormLabel>
                <FormControl>
                  <Input className="h-9" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    className="h-9"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    className="h-9"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password*</FormLabel>
                <FormControl>
                  <Input className="h-9" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-auto grid w-full max-w-[400px]">
            <SubmitButton isLoading={form.formState.isSubmitting} />
          </div>
        </form>
      </Form>
    </section>
  );
}
