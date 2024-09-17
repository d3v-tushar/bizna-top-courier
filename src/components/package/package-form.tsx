'use client';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PackageFormSchema } from '@/lib/package/package.validations';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  createPackage,
  validatePromoCode,
} from '@/lib/package/package.actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';

interface PackageFormProps {
  clientList: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    clientId: number;
    taxCode: string;
  }[];
  cargoItemList: {
    id: number;
    name: string;
    unit: string;
    rate: string;
  }[];
  hubList: {
    id: number;
    name: string;
  }[];
  zoneWithOptionList: {
    id: number;
    name: string;
    deliveryOption: {
      id: number;
      name: string | null;
    }[];
  }[];
}

export function PackageForm({
  clientList = [],
  cargoItemList = [],
  hubList = [],
  zoneWithOptionList = [],
}: PackageFormProps) {
  const searchParams = useSearchParams();
  const { push, replace } = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPromo, setIsPromo] = useState<boolean>(false);

  const form = useForm<z.infer<typeof PackageFormSchema>>({
    resolver: zodResolver(PackageFormSchema),
    defaultValues: {
      package: {
        destinationHubId: 1,
        discountAmount: '0',
        totalAmount: '0',
        note: 'Please handle with care',
      },
      lineItems: [
        {
          cargoItemId: 0,
          title: '',
          unitPrice: '',
          quantity: 1,
        },
      ],
    },
  });

  const {
    fields: lineItems,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const handleSearch = useDebouncedCallback((key: string, term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(key, term);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const handleDeleteQuery = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  async function handleApplyPromo() {
    setLoading(true);
    if (!promoCode || promoCode?.length < 5) {
      toast.error('Invalid promo code');
      return;
    }
    try {
      console.log('promo', promoCode);
      const result = await validatePromoCode(promoCode);
      console.log(result);
      if (result.success && result?.data?.value) {
        form.setValue('package.discountAmount', '0');
        form.setValue('package.promoValue', result.data.value);
        toast.success('Promo code applied successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  function getcalculateTotal() {
    const lineItems = form.watch('lineItems');
    const discountAmount =
      parseFloat(form.watch('package.discountAmount')) || 0;
    const promoValue =
      parseFloat(form.getValues('package.promoValue') as string) || 0;

    const totalBeforeDiscount = lineItems.reduce((total, item) => {
      const itemTotal = Number(item.unitPrice) * Number(item.quantity);
      return total + itemTotal;
    }, 0);

    let finalTotal = totalBeforeDiscount;

    if (isPromo && promoValue > 0) {
      // Apply promo (percentage off)
      const promoPercentage = Math.min(Math.max(promoValue, 10), 25) / 100; // Ensure promo is between 10% and 25%
      finalTotal = totalBeforeDiscount * (1 - promoPercentage);
    } else if (!isPromo && discountAmount > 0) {
      // Apply discount amount
      form.setValue('package.promoValue', '0');
      finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);
    }

    return finalTotal.toFixed(2);
  }

  console.log(form.formState.errors);

  // function getcalculateTotal() {
  //   const lineItems = form.watch('lineItems');
  //   const discountAmount =
  //     parseFloat(form.watch('package.discountAmount')) || 0;
  //   const promoValue = form.getValues('package.promoValue');

  //   const totalBeforeDiscount = lineItems.reduce((total, item) => {
  //     const itemTotal = Number(item.unitPrice) * Number(item.quantity);
  //     return total + itemTotal;
  //   }, 0);

  //   let finalTotal;

  //   if (promoValue) {
  //     // If promoValue is present, assume it's a percentage and apply it
  //     const promoPercentage = parseFloat(promoValue) / 100;
  //     finalTotal = totalBeforeDiscount * (1 - promoPercentage);
  //   } else {
  //     // If no promoValue, apply the discountAmount
  //     finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);
  //   }

  //   return finalTotal.toFixed(2);
  // }

  // function getcalculateTotal() {
  //   const lineItems = form.watch('lineItems');
  //   const discountAmount =
  //     parseFloat(form.watch('package.discountAmount')) || 0;
  //   const promoValue = form.getValues('package.promoValue');
  //   const totalBeforeDiscount = lineItems.reduce((total, item) => {
  //     const itemTotal = Number(item.unitPrice) * Number(item.quantity);
  //     return total + itemTotal;
  //   }, 0);
  //   const finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);
  //   return finalTotal.toFixed(2);
  // }

  return (
    <Card className="mt-4 rounded-md shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-bold">Create New Package</CardTitle>
        <CardDescription>
          Fill in the form to create a new package
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              const result = await createPackage(data);

              if (!result.success) {
                toast(result.message, {
                  description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
                  action: {
                    label: 'Retry',
                    onClick: () => createPackage(data),
                  },
                });
              } else {
                toast(result.message, {
                  description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
                  action: {
                    label: 'View',
                    onClick: () => push('/packages', { scroll: false }),
                  },
                });
              }
            })}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <FormStep
              title="Sender Information"
              subtitle="Enter the sender details"
            >
              <div className="grid grid-cols-1 gap-5 whitespace-nowrap md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="package.clientId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Sender Client*</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'col-span-2 w-full justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? form.getValues('sender.email')
                                : 'Select Client'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              defaultValue={
                                searchParams.get('clientQuery') || ''
                              }
                              placeholder="Search Clients..."
                              onValueChange={(value) =>
                                handleSearch('clientQuery', value)
                              }
                            />
                            <CommandList>
                              <ScrollArea className="h-40">
                                {clientList.length > 0 ? (
                                  <CommandGroup>
                                    {clientList?.map((client, idx) => (
                                      <CommandItem
                                        key={idx}
                                        value={client.email}
                                        onSelect={() => {
                                          form.setValue(
                                            'package.clientId',
                                            client.clientId,
                                          );
                                          form.setValue(
                                            'package.clientTaxCode',
                                            client.taxCode,
                                          );
                                          form.setValue(
                                            'sender.firstName',
                                            client.firstName,
                                          );
                                          form.setValue(
                                            'sender.lastName',
                                            client.lastName,
                                          );
                                          form.setValue(
                                            'sender.email',
                                            client.email,
                                          );
                                          form.setValue(
                                            'sender.phone',
                                            client.phone,
                                          );
                                          handleDeleteQuery('clientQuery');
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            client.clientId === field.value
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
                                ) : (
                                  <CommandEmpty>No client found.</CommandEmpty>
                                )}
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="package.clientTaxCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
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
                  name="sender.firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sender.lastName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sender.email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input type="email" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sender.phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input type="tel" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormStep>

            <FormStep
              title="Receipent Details"
              subtitle="Enter the recipient details"
            >
              <div className="grid grid-cols-1 gap-5 whitespace-nowrap md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="receiver.firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiver.lastName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiver.email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input type="email" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiver.phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input type="tel" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormStep>

            <FormStep
              title="Billing Address"
              subtitle="Enter the billing address"
            >
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="billingAddress.addressLine1"
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
                    name="billingAddress.addressLine2"
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
                  name="billingAddress.union"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Cumune*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.city"
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
                  name="billingAddress.state"
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
                  name="billingAddress.postalCode"
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
                  name="billingAddress.country"
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
              </section>
            </FormStep>

            <FormStep
              title="Shipping Address"
              subtitle="Enter the shipping address"
            >
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="shippingAddress.addressLine1"
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
                    name="shippingAddress.addressLine2"
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
                  name="shippingAddress.union"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Area/Union/Word</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.city"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Police Station/Upazila*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.state"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>District*</FormLabel>
                      <FormControl>
                        <Input className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress.postalCode"
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
                  name="shippingAddress.country"
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
              </section>
            </FormStep>

            <FormStep
              title="Line Items"
              subtitle="Enter line items and their quantities"
            >
              <section className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-y-6 whitespace-nowrap">
                  {lineItems.map((lineItem, index) => (
                    <div key={lineItem.id} className="flex flex-wrap gap-x-2.5">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.cargoItemId`}
                        render={({ field }) => (
                          <FormItem className="flex flex-1 flex-col">
                            <FormLabel>{index + 1}. Cargo Item*</FormLabel>
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
                                      ? form.getValues(
                                          `lineItems.${index}.title`,
                                        )
                                      : 'Select Cargo Type'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-full max-w-sm text-ellipsis p-0"
                                align="start"
                              >
                                <Command shouldFilter={false}>
                                  <CommandInput
                                    defaultValue={
                                      searchParams.get('cargoQuery') || ''
                                    }
                                    placeholder="Search Clients..."
                                    onValueChange={(value) =>
                                      handleSearch('cargoQuery', value)
                                    }
                                  />
                                  <CommandList className="w-full max-w-sm text-ellipsis">
                                    <ScrollArea className="h-40">
                                      {cargoItemList.length > 0 ? (
                                        <CommandGroup>
                                          {cargoItemList.map(
                                            (cargoItem: {
                                              id: number;
                                              name: string;
                                              rate: string;
                                            }) => (
                                              <CommandItem
                                                key={cargoItem.id}
                                                value={cargoItem.name}
                                                onSelect={() => {
                                                  form.setValue(
                                                    `lineItems.${index}.cargoItemId`,
                                                    cargoItem.id,
                                                  );
                                                  form.setValue(
                                                    `lineItems.${index}.unitPrice`,
                                                    cargoItem.rate,
                                                  );
                                                  form.setValue(
                                                    `lineItems.${index}.title`,
                                                    cargoItem.name,
                                                  );
                                                  handleDeleteQuery(
                                                    'cargoQuery',
                                                  );
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    'mr-2 h-4 w-4',
                                                    cargoItem.id === field.value
                                                      ? 'opacity-100'
                                                      : 'opacity-0',
                                                  )}
                                                />
                                                {cargoItem.name}
                                              </CommandItem>
                                            ),
                                          )}
                                        </CommandGroup>
                                      ) : (
                                        <CommandEmpty>
                                          No Cargo found.
                                        </CommandEmpty>
                                      )}
                                    </ScrollArea>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex w-full items-center gap-x-2.5">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="sr-only">Rate</FormLabel>
                              <FormControl>
                                <Input
                                  readOnly
                                  placeholder="Rate"
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
                          name={`lineItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="sr-only">
                                Quantity
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Qty"
                                  className="h-9"
                                  {...field}
                                  type="number"
                                  min="1"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="col-span-1 mt-auto text-sm"
                          onClick={() => remove(index)}
                        >
                          X
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2.5 text-sm"
                    onClick={() =>
                      append({
                        cargoItemId: 0,
                        title: '',
                        unitPrice: '',
                        quantity: 1,
                      })
                    }
                  >
                    Add Item
                  </Button>
                </div>
              </section>
            </FormStep>

            <FormStep
              title="Package Summary"
              subtitle="Enter delivery details & promo code"
            >
              <section className="grid gap-5">
                <FormField
                  control={form.control}
                  name="package.destinationHubId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Destination Hub*</FormLabel>
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
                                ? hubList.find((hub) => hub.id === field.value)
                                    ?.name
                                : 'Select Destination Hub'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Search Hub..."
                              onValueChange={(value) =>
                                handleSearch('hubQuery', value)
                              }
                            />
                            <CommandList>
                              <ScrollArea className="h-40">
                                {hubList.length > 0 ? (
                                  <CommandGroup>
                                    {hubList.map((hub) => (
                                      <CommandItem
                                        key={hub.id}
                                        value={hub.name}
                                        onSelect={() => {
                                          form.setValue(
                                            'package.destinationHubId',
                                            hub.id,
                                          );
                                          handleDeleteQuery('hubQuery');
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            hub.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                        {hub.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                ) : (
                                  <CommandEmpty>No Hub found.</CommandEmpty>
                                )}
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="package.deliveryZoneId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Delivery Zone*</FormLabel>
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
                                  ? zoneWithOptionList.find(
                                      (zone) => zone.id === field.value,
                                    )?.name
                                  : 'Select Delivery Zone'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Search Delivery Zone..."
                                onValueChange={(value) =>
                                  handleSearch('zoneQuery', value)
                                }
                              />
                              <CommandList>
                                <ScrollArea className="h-40">
                                  {zoneWithOptionList.length > 0 ? (
                                    <CommandGroup>
                                      {zoneWithOptionList.map((zone) => (
                                        <CommandItem
                                          key={zone.id}
                                          value={zone.name}
                                          onSelect={() => {
                                            form.setValue(
                                              'package.deliveryZoneId',
                                              zone.id,
                                            );
                                            form.resetField(
                                              'package.deliveryOptionId',
                                            );
                                            handleDeleteQuery('zoneQuery');
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              zone.id === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                            )}
                                          />
                                          {zone.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  ) : (
                                    <CommandEmpty>
                                      No Result found.
                                    </CommandEmpty>
                                  )}
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="package.deliveryOptionId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Delivery Option*</FormLabel>
                        <FormControl>
                          <Select
                            disabled={
                              zoneWithOptionList.filter(
                                (zone) =>
                                  zone.id ===
                                  form.getValues('package.deliveryZoneId'),
                              ).length === 0
                            }
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Select Delivery Option" />
                            </SelectTrigger>
                            <SelectContent>
                              {zoneWithOptionList
                                .filter(
                                  (zone) =>
                                    zone.id ===
                                    form.getValues('package.deliveryZoneId'),
                                )[0]
                                ?.deliveryOption?.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={String(option.id)}
                                  >
                                    {option.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="package.note"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Description of Package</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add a note to the package
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isPromo ? (
                  <FormField
                    control={form.control}
                    name="package.discountAmount"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPromo}
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the Discount in Euro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="grid grid-cols-3 items-end gap-2">
                    <div className="col-span-2 flex flex-col gap-3">
                      <Label htmlFor="promo">Promo Code</Label>
                      <Input
                        disabled={
                          parseFloat(
                            form.watch('package.promoValue') as string,
                          ) > 0
                        }
                        value={promoCode}
                        onChange={(evt) => setPromoCode(evt.target.value)}
                        id="promo"
                        className="h-9"
                      />
                    </div>

                    <Button
                      onClick={handleApplyPromo}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="-mt-3 h-9"
                      disabled={loading || !promoCode}
                    >
                      {loading ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                )}

                <div className="mb-2.5 flex items-center space-x-2">
                  <Checkbox
                    checked={isPromo}
                    onCheckedChange={() => setIsPromo(!isPromo)}
                    id="isPromo"
                  />
                  <label
                    htmlFor="isPromo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I will use promo code
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="totalAmount">Total Value</Label>
                  <output
                    id="totalAmount"
                    name="package.totalAmount"
                    className="inline-block rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900"
                  >
                    €{getcalculateTotal()}
                  </output>
                  <p className="text-sm text-gray-500">
                    Total is calculated based on line items and discount value
                  </p>
                </div>
              </section>
            </FormStep>

            <Button
              onClick={() => form.reset()}
              variant="destructive"
              type="reset"
            >
              Reset Form
            </Button>
            <Button type="submit">
              {form.formState.isSubmitting
                ? 'Please Wait...'
                : 'Create Package'}
            </Button>

            {Object.keys(form.formState.errors).length > 0 && (
              <ul className="col-span-2 mt-4 text-sm text-red-500">
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <li key={field}>{error.message}</li>
                ))}
              </ul>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const FormStep = ({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <fieldset className="flex flex-col gap-4 p-1">
    <div className="mb-4 border-b pb-2">
      <legend className="font-semibold">{title}</legend>
      <span className="text-xs md:text-sm">{subtitle}</span>
    </div>
    {children}
  </fieldset>
);
