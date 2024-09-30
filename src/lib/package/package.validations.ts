import { z } from 'zod';
import {
  PACKAGE_LABEL,
  PACKAGE_STATUS,
  PAYMENT_METHOD,
} from './package.constants';
import {
  InsertPackage,
  InsertPackageItem,
  IPackage,
} from '../database/schema/package';

export const PartySchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long.' })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .trim(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters long.' })
    .max(11, { message: 'Phone number must be at most 11 characters long.' })
    .regex(/^\d{10,11}$/, 'Please enter a valid phone number')
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
});

export const AddressSchema = z.object({
  addressLine1: z
    .string()
    .min(10, { message: 'Address line 1 must be at least 2 characters long.' })
    .trim(),
  addressLine2: z.string().trim().optional(),
  // union: z
  //   .string()
  //   .trim()
  //   .min(2, { message: 'Union must be at least 2 characters long.' })
  //   .optional(),
  union: z.string().trim().optional(),
  city: z
    .string()
    .min(2, { message: 'City must be at least 2 characters long.' })
    .trim(),
  state: z
    .string()
    .min(2, { message: 'State must be at least 2 characters long.' })
    .trim(),
  postalCode: z
    .string()
    .min(4, { message: 'Postal code must be at least 2 characters long.' })
    .trim(),
  country: z
    .string()
    .min(2, { message: 'Country must be at least 2 characters long.' })
    .trim(),
});

export const LineItemSchema = z.object({
  id: z.number().int().positive().optional(),
  packageId: z.number().int().positive().optional(),
  cargoItemId: z.coerce
    .number()
    .int()
    .positive({ message: 'Please select a cargo item' }),
  unitPrice: z.coerce.string().min(1, { message: 'Rate Required' }),
  quantity: z.coerce.number().int().positive({ message: 'Quantity Required' }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const PackageSchemaZod: z.ZodType<
  Omit<
    IPackage,
    | 'status'
    | 'label'
    | 'paymentMethod'
    | 'discountAmount'
    | 'totalAmount'
    | 'deliveryCost'
  >
> = z.object({
  id: z.number(),
  barcode: z.string(),
  status: z
    .enum([...PACKAGE_STATUS] as [string, ...string[]])
    .default('in progress'),
  label: z
    .enum([...PACKAGE_LABEL] as [string, ...string[]])
    .default('Received At Hub'),
  note: z.string().trim(),
  clientId: z.coerce.number().int().positive(),
  clientTaxCode: z
    .string()
    .min(12, { message: 'Tax code must be 12 characters' })
    .trim(),
  agentId: z.coerce.number().int().positive(),
  senderId: z.coerce.number().int().positive(),
  receiverId: z.coerce.number().int().positive(),
  billingAddressId: z.coerce.number().int().positive(),
  shippingAddressId: z.coerce.number().int().positive(),
  deliveryZoneId: z.coerce.number().int().positive(),
  deliveryOptionId: z.coerce.number().int().positive(),
  discountAmount: z.string().trim().default('0'),
  totalAmount: z.string().trim().default('0'),
  sourceHubId: z.coerce.number().int().positive(),
  destinationHubId: z.coerce.number().int().positive(),
  deliveryCost: z.string().trim().default('0'),
  paymentMethod: z.string().trim().default('cash'),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DeliverySchema = z.object({
  sourceHubId: z.coerce.number().int().positive(),
  sourceHubName: z.string().min(2, { message: 'Required' }).trim(),
  destinationHubId: z.coerce.number().int().positive(),
  destinationHubName: z.string().min(2, { message: 'Required' }).trim(),
  deliveryZoneId: z.coerce.number().int().positive(),
  deliveryZoneName: z.string().min(2, { message: 'Required' }).trim(),
  deliveryOptionId: z.coerce.number().int().positive(),
  deliveryOptionName: z.string().min(2, { message: 'Required' }).trim(),
});

export const PackageSchema = z.object({
  id: z.number().int().positive().optional(),
  barcode: z.string().trim().optional(),
  status: z.enum(PACKAGE_STATUS).default('in progress'),
  label: z.enum(PACKAGE_LABEL).default('Received At Hub'),
  note: z.string().trim().optional().default('Please handle with care'),
  agentId: z.coerce.number().int().positive().optional(),
  clientId: z.coerce.number().int().positive(),
  clientTaxCode: z
    .string()
    .trim()
    .length(16, { message: 'Tax code must be 16 characters' }),
  senderId: z.number().int().positive().optional(),
  receiverId: z.number().int().positive().optional(),
  billingAddressId: z.number().int().positive().optional(),
  shippingAddressId: z.number().int().positive().optional(),
  deliveryZoneId: z.coerce.number().int().positive(),
  deliveryOptionId: z.coerce.number().int().positive(),
  discountAmount: z.string().trim().default('0'),
  totalAmount: z.string().trim().optional(),
  deliveryCost: z.string().trim().optional(),
  paymentMethod: z.enum(PAYMENT_METHOD).default('CASH'),
  sourceHubId: z.coerce.number().int().positive().optional(),
  destinationHubId: z.coerce.number().int().positive(),
  isArchived: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// export const PackageFormSchema = z
//   .object({
//     package: PackageSchema.extend({
//       promoValue: z.string().trim().default('0').optional(),
//     }),
//     sender: PartySchema,
//     receiver: PartySchema,
//     billingAddress: AddressSchema,
//     shippingAddress: AddressSchema,
//     lineItems: z
//       .array(
//         LineItemSchema.extend({
//           title: z.string().min(1, { message: 'Title Required' }),
//         }),
//       )
//       .min(1, { message: 'At least one item is required' }),
//   })
//   .superRefine((data, ctx) => {
//     // Calculate total amount before discount or promo
//     const totalItemAmount = data.lineItems.reduce((total, item) => {
//       const itemTotal = Number(item.unitPrice) * item.quantity;
//       return total + itemTotal;
//     }, 0);

//     const discount = Number(data.package.discountAmount);
//     const promoValue = Number(data.package.promoValue);

//     // Determine whether to use promo or discount
//     const usePromo = promoValue > 0;

//     let finalTotal;

//     if (usePromo) {
//       // Validate and apply promo
//       if (isNaN(promoValue) || promoValue < 10 || promoValue > 25) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Promo value must be between 10 and 25',
//           path: ['package', 'promoValue'],
//         });
//         return;
//       }
//       const promoPercentage = promoValue / 100;
//       finalTotal = totalItemAmount * (1 - promoPercentage);
//     } else {
//       // Validate and apply discount
//       if (isNaN(discount)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Invalid discount amount',
//           path: ['package', 'discountAmount'],
//         });
//         return;
//       }
//       if (discount > totalItemAmount) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Discount cannot be greater than total item amount',
//           path: ['package', 'discountAmount'],
//         });
//         return;
//       }
//       finalTotal = totalItemAmount - discount;
//     }

//     // Update totalAmount
//     data.package.totalAmount = finalTotal.toFixed(2);

//     // Ensure that only one of promo or discount is applied
//     if (usePromo && discount > 0) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Cannot apply both promo and discount',
//         path: ['package'],
//       });
//     }
//   });

export const PackageFormSchema = z
  .object({
    package: PackageSchema.extend({
      promoValue: z.string().trim().default('0').optional(),
    }),
    sender: PartySchema,
    receiver: PartySchema,
    billingAddress: AddressSchema,
    shippingAddress: AddressSchema,
    lineItems: z
      .array(
        LineItemSchema.extend({
          title: z.string().min(1, { message: 'Title Required' }),
        }),
      )
      .min(1, { message: 'At least one item is required' }),
  })
  .superRefine((data, ctx) => {
    // Calculate total amount before discount or promo
    const totalItemAmount = data.lineItems.reduce((total, item) => {
      const itemTotal = Number(item.unitPrice) * item.quantity;
      return total + itemTotal;
    }, 0);
    const discount = Number(data.package.discountAmount);
    const promoValue = Number(data.package.promoValue);
    // Determine whether to use promo or discount
    const usePromo = promoValue > 0;
    let finalTotal;

    if (usePromo) {
      // Validate and apply promo
      if (isNaN(promoValue) || promoValue < 10 || promoValue > 25) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Promo value must be between 10 and 25',
          path: ['package', 'promoValue'],
        });
        return;
      }
      const promoPercentage = promoValue / 100;
      finalTotal = totalItemAmount * (1 - promoPercentage);
    } else {
      // Validate and apply discount
      if (isNaN(discount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid discount amount',
          path: ['package', 'discountAmount'],
        });
        return;
      }

      // New check: Ensure discount is not more than 10% of totalItemAmount
      const maxDiscount = totalItemAmount * 0.1;
      if (discount > maxDiscount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Discount cannot be more than 10% of the total amount',
          path: ['package', 'discountAmount'],
        });
        return;
      }

      finalTotal = totalItemAmount - discount;
    }

    // Update totalAmount
    data.package.totalAmount = finalTotal.toFixed(2);

    // Ensure that only one of promo or discount is applied
    if (usePromo && discount > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cannot apply both promo and discount',
        path: ['package'],
      });
    }
  });

export const PackageUpdateSchema = PackageSchema.pick({
  id: true,
  status: true,
  label: true,
  deliveryCost: true,
}).extend({
  deliveryCost: z.string().trim().optional(),
});

// Form schema
export const PackageLogSchema = z.object({
  id: z.number().optional(),
  barcode: z.string().trim().min(10, 'Barcode is required'),
  status: z.enum(PACKAGE_STATUS),
  label: z.enum(PACKAGE_LABEL),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
