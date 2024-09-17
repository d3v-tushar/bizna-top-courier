'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const languages = [
  { label: 'English Bhasha Roy', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const;

const steps = [
  { label: 'Sender', value: 1 },
  { label: 'Receiver', value: 2 },
  { label: 'Product', value: 3 },
  { label: 'Payment', value: 4 },
  { label: 'Review', value: 5 },
  { label: 'Invoice Details', value: 6 },
  { label: 'Summary', value: 7 },
];

// Define enums for status and payment status
const PackageStatus = z.enum([
  'in progress',
  'dispatched',
  'on air',
  'delivered',
]);
const PaymentStatus = z.enum(['PAID', 'UNPAID', 'PARTIALLY_PAID']);
const PartyType = z.enum(['SENDER', 'RECEIVER']);

// Hub schema
const hubSchema = z.object({
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  addressId: z.number(),
  latitude: z.string(),
  longitude: z.string(),
});

// Party schema (for sender and receiver)
const partySchema = z.object({
  type: PartyType,
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
});

const addressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string(),
  union: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
});

// Package Item schema
const packageItemSchema = z.object({
  name: z.string(),
  cargoId: z.string(),
  //   unitPrice: z.number().positive(),
  //   quantity: z.number().int().positive(),
  unitPrice: z.string(),
  quantity: z.string(),
});

// Package schema
const packageSchema = z.object({
  listedFor: z.string(),
  clientTaxCode: z.string(),
  //   listedBy: z.number(),
  items: z.array(packageItemSchema),
  note: z.string(),
});

// Invoice schema
const invoiceSchema = z.object({
  deliveryZoneId: z.string(),
  deliveryOptionId: z.string(),
  //   totalBill: z.string().regex(/^\d+(\.\d{1,2})?$/), // Allows for decimal numbers with up to 2 decimal places
  discounts: z.string().nullable().optional(),
  paymentStatus: PaymentStatus.optional(),
});

// Combined schema for package insertion
const packageInsertionSchema = z.object({
  package: packageSchema,
  sender: partySchema,
  receiver: partySchema,
  billing: addressSchema,
  shipping: addressSchema,
  invoice: invoiceSchema,
  //   sourceHub: hubSchema,
  //   destinationHub: hubSchema,
});

// Infer the TypeScript type
type PackageInsertionType = z.infer<typeof packageInsertionSchema>;

interface InvoiceFormProps {
  clintList: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    client: {
      id: number;
      taxCode: string;
    };
  }[];
  cargoList: {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    unit: string;
    rate: string;
  }[];
  zoneList: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deliveryOption: {
      id: number;
      name: string | null;
      createdAt: Date;
      updatedAt: Date;
      deliveryZoneId: number;
    }[];
  }[];
}

export function InvoiceForm({
  clintList,
  cargoList,
  zoneList,
}: InvoiceFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm({
    resolver: zodResolver(packageInsertionSchema),
    defaultValues: {
      package: {
        listedFor: '',
        status: 'in progress',
        clientTaxCode: '',
        items: [{ name: '', quantity: '', unitPrice: '', cargoId: '' }],
        note: '',
      },
      invoice: {
        deliveryZoneId: '',
        deliveryOptionId: '',
        paymentStatus: 'UNPAID',
        discounts: '',
      },
      sender: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: 'SENDER',
      },
      receiver: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: 'RECEIVER',
      },
      billing: {
        addressLine1: '',
        addressLine2: '',
        union: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      shipping: {
        addressLine1: '',
        addressLine2: '',
        union: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
    },
  });

  function handleClientSelect(client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    client: {
      id: number;
      taxCode: string;
    };
  }) {
    form.setValue('package.listedFor', String(client.client.id));
    form.setValue('package.clientTaxCode', client.client.taxCode);
    form.setValue('sender.firstName', client.firstName);
    form.setValue('sender.lastName', client.lastName);
    form.setValue('sender.email', client.email);
    form.setValue('sender.phone', client.phone);
  }

  console.log('error', form.formState.errors);

  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardContent className="mt-6">
        <Form {...form}>
          <div className="flex max-w-sm flex-wrap justify-center gap-2">
            {steps.map((step) => (
              <Button
                key={step.value}
                variant={currentStep === step.value ? 'default' : 'outline'}
                onClick={() => setCurrentStep(step.value)}
                type="button"
              >
                {step.value}. {step.label}
              </Button>
            ))}
          </div>
          <form
            onSubmit={form.handleSubmit((data) => console.log(data))}
            className="grid max-w-sm grid-cols-1 gap-4 space-y-8"
          >
            {/* Sender Details */}
            {currentStep === 1 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Bill From</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 whitespace-nowrap">
                  <FormField
                    control={form.control}
                    name="package.listedFor"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="font-normal">
                          Client Name
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-full justify-between',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value
                                  ? clintList.find(
                                      (cient: {
                                        firstName: string;
                                        lastName: string;
                                        email: string;
                                        phone: string;
                                        client: {
                                          id: number;
                                          taxCode: string;
                                        };
                                      }) =>
                                        String(cient.client.id) === field.value,
                                    )?.email
                                  : 'Select Client'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[384px] p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search Clients..." />
                              <CommandList>
                                <ScrollArea className="h-40">
                                  <CommandEmpty>
                                    No language found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {clintList.map((client: any) => (
                                      <CommandItem
                                        key={client.client.id}
                                        value={client.client.id}
                                        onSelect={() => {
                                          handleClientSelect(client);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            client.client.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                        {client.firstName +
                                          ' ' +
                                          client.lastName}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="package.clientTaxCode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Cllent Tax Code</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sender.firstName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sender.lastName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sender.email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sender.phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            )}

            {/* Receiver Details */}
            {currentStep === 2 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Bill To</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 whitespace-nowrap">
                  <FormField
                    control={form.control}
                    name="receiver.firstName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receiver.lastName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receiver.email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receiver.phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            )}

            {/* Billing Address */}
            {currentStep === 3 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Billing Address</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 whitespace-nowrap">
                  <FormField
                    control={form.control}
                    name="billing.addressLine1"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billing.addressLine2"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billing.union"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Union/ Community</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billing.city"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing.state"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing.country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing.postalCode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Post Code</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            )}

            {/* Shipping Address */}
            {currentStep === 4 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 whitespace-nowrap">
                  <FormField
                    control={form.control}
                    name="shipping.addressLine1"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping.addressLine2"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping.union"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Union/ Community</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping.city"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.state"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.postalCode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Post Code</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-9" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            )}

            {/* Line Items */}
            {currentStep === 5 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Line Items</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 whitespace-nowrap">
                  {form.watch('package.items').map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2.5">
                      <FormField
                        control={form.control}
                        name={`package.items.${index}.cargoId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={String(field.value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a cargo" />
                              </SelectTrigger>
                              <SelectContent>
                                {cargoList.map((cargo) => (
                                  <SelectItem
                                    key={cargo.id}
                                    value={String(cargo.id)}
                                  >
                                    {cargo.name}
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
                        name={`package.items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2.5 text-sm"
                    onClick={() =>
                      form.setValue('package.items', [
                        ...form.watch('package.items'),
                        { name: '', unitPrice: '', cargoId: '', quantity: '1' },
                      ])
                    }
                  >
                    Add Item
                  </Button>
                </div>
              </section>
            )}

            {/* Delivery Zone & Options */}
            {currentStep === 6 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Delivery Options</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 whitespace-nowrap">
                  <FormField
                    control={form.control}
                    name="invoice.deliveryZoneId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Delivery Zone</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={String(field.value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Delivery Zone" />
                            </SelectTrigger>
                            <SelectContent>
                              {zoneList.map((zone) => (
                                <SelectItem
                                  key={zone.id}
                                  value={String(zone.id)}
                                >
                                  {zone.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoice.deliveryOptionId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Delivery Option</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={String(field.value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Delivery Option" />
                            </SelectTrigger>
                            <SelectContent>
                              {zoneList
                                .filter(
                                  (zone) =>
                                    String(zone.id) ===
                                    form.getValues('invoice.deliveryZoneId'),
                                )[0]
                                ?.deliveryOption?.map((option) => (
                                  <SelectItem
                                    key={String(option.id)}
                                    value={String(option.id)}
                                  >
                                    {option.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            )}

            {/* Package Summary */}
            {currentStep === 7 && (
              <section className="max-w-sm">
                <h2 className="text-xl font-semibold">Package Details</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 whitespace-nowrap">
                  <FormField
                    control={form.control}
                    name="package.note"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Delivery Zone</FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoice.discounts"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Discounts</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <output>
                    {form
                      .getValues('package.items')
                      .reduce((a, b) => a + Number(b.unitPrice), 0)}
                  </output>
                </div>
              </section>
            )}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
