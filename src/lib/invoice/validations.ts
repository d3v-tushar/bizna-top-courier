import { z } from 'zod';

export const InvoiceValidation = z.object({
  id: z.number(),
  packageId: z.number(),
  discount: z.number(),
  total: z.number(),
  paymentStatus: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InvoiceType = z.infer<typeof InvoiceValidation>;
