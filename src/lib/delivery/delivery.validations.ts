import { z } from 'zod';

export const deliveryZoneSchema = z.object({
  id: z.number().positive().optional(),
  name: z
    .string()
    .min(1, { message: 'Zone name is required' })
    .max(100, { message: 'Zone name must be 100 characters or less' }),
  isActive: z
    .union([z.boolean(), z.string()])
    .transform((value) =>
      typeof value === 'string' ? value.toLowerCase() === 'true' : value,
    )
    .default(true),
});

export const deliveryOptionSchema = z.object({
  id: z.number().positive().optional(),
  name: z
    .string()
    .min(1, { message: 'Option name is required' })
    .max(100, { message: 'Option name must be 100 characters or less' }),
  shippingCharge: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message:
        'Shipping charge must be a valid decimal with up to two decimal places',
    })
    .default('0'),
  deliveryZoneId: z
    .number()
    .positive({ message: 'A valid delivery zone ID is required' })
    .optional(),
  isActive: z
    .union([z.boolean(), z.string()])
    .transform((value) =>
      typeof value === 'string' ? value.toLowerCase() === 'true' : value,
    )
    .default(true),
});
