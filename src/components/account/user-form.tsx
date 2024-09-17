'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { LoadingDots } from '../shared/loading-dots';
import { X } from 'lucide-react';

interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
}

const UserFormSchema = z.object({
  id: z.number().optional(),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long.' })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .trim(),
  phone: z.string().regex(/^\d{10,11}$/, 'Please enter a valid phone number'),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'File size should be less than 2MB',
    })
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(
          file.type,
        ) ||
        (file.size === 0 && file.type === 'application/octet-stream'),
      {
        message:
          'Unsupported file type. Please upload a JPEG, PNG, WebP, or GIF image.',
      },
    )
    .optional(),
  role: z.enum(['ADMIN', 'AGENT', 'CLIENT']).optional(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  isActive: z.coerce.boolean().optional().default(true),
});

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      aria-disabled={pending || isLoading}
      type="submit"
      className="mt-4 w-full"
    >
      {pending || isLoading ? <LoadingDots /> : 'Save'}
    </Button>
  );
}

interface UserFormProps {
  defaultValues?: z.infer<typeof UserFormSchema>;
  action: (
    formState: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
}

export function UserForm({ defaultValues, action }: UserFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(action, undefined);
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(
      defaultValues
        ? UserFormSchema.omit({ password: true }).extend({
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
        : UserFormSchema,
    ),
    defaultValues: {
      ...defaultValues,
      ...(state?.fields ?? {}),
    },
  });

  return (
    <Form {...form}>
      <form
        action={formAction}
        ref={formRef}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
        className="flex flex-col gap-4 p-1"
      >
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
                  id="image-upload"
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
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Status</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(e.target.value === 'true')}
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
        <SubmitButton isLoading={form.formState.isSubmitting} />
      </form>
    </Form>
  );
}
