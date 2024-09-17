import { z } from 'zod';

export const cargoFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  description: z.string().trim().optional(),
  unit: z.string().trim().min(1, { message: 'Unit is required' }),
  rate: z.string().trim().min(1, { message: 'Rate is required' }),
  isActive: z
    .union([z.boolean(), z.string()])
    .transform((value) =>
      typeof value === 'string'
        ? value.toLowerCase() === 'true'
          ? true
          : false
        : value,
    )
    .default(true),
});
