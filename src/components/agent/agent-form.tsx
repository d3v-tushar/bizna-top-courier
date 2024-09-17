'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AgentFormSchema } from '@/lib/user/user.validations';
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

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || isLoading}
      aria-disabled={pending}
      type="submit"
    >
      {pending || isLoading ? <LoadingDots /> : 'Save'}
    </Button>
  );
}

export default function AgentForm({
  label,
  description,
  defaultValues,
  action,
}: {
  label: string;
  description: string;
  defaultValues?: z.infer<typeof AgentFormSchema>;
  action: (
    formState: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(action, undefined);
  const form = useForm<z.infer<typeof AgentFormSchema>>({
    resolver: zodResolver(
      defaultValues
        ? AgentFormSchema.omit({
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
        : AgentFormSchema,
    ),
    defaultValues: {
      ...defaultValues,
      ...(state?.fields ?? {}),
    },
  });

  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardHeader className="border-b">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
      </CardHeader>
      <CardContent className="mt-6">
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
            className="flex flex-col gap-6"
          >
            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <fieldset className="flex flex-col gap-y-6">
                <div className="mb-1.5 border-b pb-2">
                  <legend className="font-semibold">User Information</legend>
                  <span className="text-xs md:text-sm">
                    Enter User Related Information
                  </span>
                </div>

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
                          <Input
                            className="h-9"
                            placeholder="Robinson"
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
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carta Di Identita/ Permesso</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Italin Passport Number"
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
              </fieldset>

              <fieldset className="flex flex-col gap-y-6">
                <div className="mb-1.5 border-b pb-2">
                  <legend className="font-semibold">Agent Information</legend>
                  <span className="text-xs md:text-sm">
                    Enter Agent Information
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="hubId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Hub ID*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Hub ID"
                          className="h-9"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>C.F*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Codice Fiscale (Italian Tax Code)"
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
                  name="vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.IVA*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Partita IVA (Italian VAT Number)"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth*</FormLabel>
                        <FormControl>
                          <Input type="date" className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placeOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth*</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBAN Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="IBAN (International Bank Account Number)"
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
                  name="contractPdf"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Contract PDF</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9"
                          type="file"
                          accept="application/pdf"
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
              </fieldset>

              <fieldset className="flex flex-col gap-y-[16px]">
                <div className="mb-2 border-b pb-2">
                  <legend className="font-semibold">Address Information</legend>
                  <span className="text-xs md:text-sm">
                    Enter Agent Address
                  </span>
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address*</FormLabel>
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
                        <FormLabel className="sr-only">
                          Address Line 2
                        </FormLabel>
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
                      <FormLabel>Comune</FormLabel>
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
                      <FormLabel>City*</FormLabel>
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
                      <FormLabel>State/Province*</FormLabel>
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
                      <FormLabel>Postal Code*</FormLabel>
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
                      <FormLabel>Country*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
            </section>

            <div className="ml-auto grid w-full grid-cols-2 justify-between gap-4 md:w-2/5 md:grid-cols-2">
              <Button
                onClick={() => form.reset()}
                type="reset"
                variant="outline"
              >
                Reset
              </Button>
              <SubmitButton isLoading={form.formState.isSubmitting} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
