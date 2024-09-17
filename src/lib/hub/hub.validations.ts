import { z } from 'zod';
import { AddressSchema } from '../package/package.validations';

// export const HubFormSchema = z.object({
//   name: z.string().min(1, { message: 'Name is required' }),
//   latitude: z.string().min(-90).max(90),
//   longitude: z.string().min(-180).max(180),
//   isActive: z.boolean().default(true),
//   address: AddressSchema,
// });

// export const HubSchema = z.object({
//   id: z.number().int().positive().optional(),
//   name: z.string().min(1, { message: 'Name is required' }),
//   latitude: z.string().min(-90).max(90),
//   longitude: z.string().min(-180).max(180),
//   isActive: z.coerce.boolean().optional().default(true),
//   addressId: z.number().int().positive().optional(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional(),
// });

export const HubSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, { message: 'Name is required' }),
  latitude: z.string().min(-90).max(90),
  longitude: z.string().min(-180).max(180),
  isActive: z.preprocess(
    (val) => (val === 'false' ? false : val === 'true' ? true : val),
    z.boolean().optional().default(true),
  ),
  addressId: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const HubFormSchema = z.object({
  ...HubSchema.shape,
  ...AddressSchema.shape,
});

// export const HubFormSchema = z.object({
//   name: z
//     .string()
//     .min(1, { message: 'Name is required' })
//     .max(256, { message: 'Name must be 256 characters or less' }),
//   address: AddressSchema,
//   latitude: z
//     .string()
//     .min(1, { message: 'Latitude is required' })
//     .refine(
//       (lat) => {
//         const num = parseFloat(lat);
//         return !isNaN(num) && num >= -90 && num <= 90;
//       },
//       { message: 'Latitude must be a number between -90 and 90' },
//     ),
//   longitude: z
//     .string()
//     .min(1, { message: 'Longitude is required' })
//     .refine(
//       (lon) => {
//         const num = parseFloat(lon);
//         return !isNaN(num) && num >= -180 && num <= 180;
//       },
//       { message: 'Longitude must be a number between -180 and 180' },
//     ),
//   isActive: z.coerce.boolean().default(true),
// });
