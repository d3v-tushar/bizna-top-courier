// 'use client';

// import { ResponsiveDialog } from '../shared/responsive-dialog';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import { format } from 'date-fns';
// import { HubFormSchema } from '@/lib/hub/hub.validations';

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { createHub } from '@/lib/hub/hub.actions';

// interface HubFormProps {
//   meta: {
//     label: string;
//     title: string;
//     description: string;
//   };
//   defaultValues?: z.infer<typeof HubFormSchema>;
// }

// export function HubForm({ meta, defaultValues }: HubFormProps) {
//   const [open, setOpen] = useState(false);
//   const form = useForm<z.infer<typeof HubFormSchema>>({
//     resolver: zodResolver(HubFormSchema),
//     defaultValues,
//   });

//   return (
//     <ResponsiveDialog
//       title={meta.title}
//       description={meta.description}
//       label={meta.label}
//       open={open}
//       setOpen={setOpen}
//     >
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(async (values) => {
//             const result = await createHub(values);
//             if (!result.success) {
//               toast(result.message, {
//                 description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
//               });
//               setOpen(false);
//             }
//             toast(result.message, {
//               description: format(new Date(), 'EEEE MMMM dd yyyy hh:mm a'),
//             });
//             form.reset();
//             setOpen(false);
//           })}
//           className="grid grid-cols-1 gap-2 px-4 md:px-1"
//         >
//           <Accordion type="single" collapsible className="w-full">
//             <AccordionItem value="item-1">
//               <AccordionTrigger>Hub Information</AccordionTrigger>
//               <AccordionContent className="flex flex-col gap-6 px-1">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Central Hub" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="isActive"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Status</FormLabel>
//                       <Select onValueChange={field.onChange}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a status" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="true">Active</SelectItem>
//                           <SelectItem value="false">Draft</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="latitude"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Latitude</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="longitude"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Longitude</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-2">
//               <AccordionTrigger>Hub Address</AccordionTrigger>
//               <AccordionContent className="grid grid-cols-2 gap-[15px] px-1">
//                 <div className="col-span-2">
//                   <FormField
//                     control={form.control}
//                     name="address.addressLine1"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Address</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Street address or P.O. Box"
//                             className="h-9"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="address.addressLine2"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="sr-only">
//                           Address Line 2
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Apt, suite, unit, building, floor, etc."
//                             className="h-9"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <FormField
//                   control={form.control}
//                   name="address.union"
//                   render={({ field }) => (
//                     <FormItem className="col-span-2">
//                       <FormLabel>Union/ Community</FormLabel>
//                       <FormControl>
//                         <Input className="h-9" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="address.city"
//                   render={({ field }) => (
//                     <FormItem className="col-span-2 md:col-span-1">
//                       <FormLabel>City</FormLabel>
//                       <FormControl>
//                         <Input className="h-9" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="address.state"
//                   render={({ field }) => (
//                     <FormItem className="col-span-2 md:col-span-1">
//                       <FormLabel>State / Province</FormLabel>
//                       <FormControl>
//                         <Input className="h-9" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="address.postalCode"
//                   render={({ field }) => (
//                     <FormItem className="col-span-2 md:col-span-1">
//                       <FormLabel>Postal Code</FormLabel>
//                       <FormControl>
//                         <Input className="h-9" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="address.country"
//                   render={({ field }) => (
//                     <FormItem className="col-span-2 md:col-span-1">
//                       <FormLabel>Country</FormLabel>
//                       <FormControl>
//                         <Input className="h-9" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>

//           <Button
//             className="col-span-2"
//             disabled={
//               form.formState.isSubmitting ||
//               Object.keys(form.formState.errors).length > 0
//             }
//             type="submit"
//           >
//             {form.formState.isSubmitting ? 'Please Wait...' : 'Create'}
//           </Button>
//         </form>
//       </Form>
//     </ResponsiveDialog>
//   );
// }
