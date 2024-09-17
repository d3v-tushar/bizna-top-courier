import { z } from 'zod';
import { SignupFormSchema } from '../auth/validations';
import { AddressSchema } from '../package/package.validations';

export const UserFormSchema = z.object({
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
  isActive: z
    .union([z.boolean(), z.string()])
    .transform((value) =>
      typeof value === 'string' ? value.toLowerCase() === 'true' : value,
    )
    .default(true),
});

export const AgentSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  vatNumber: z
    .string()
    .trim()
    .length(11, 'Partita IVA must be 11 digits long')
    .regex(/^\d+$/, 'Partita IVA must contain only digits'),
  taxCode: z
    .string()
    .trim()
    .length(16, 'Enter Valid Codice Fiscale (Italian Tax Code)'),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'Date of Birth is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  placeOfBirth: z.string().trim().min(1, 'Place of Birth is required').max(100),
  iban: z
    .string()
    .trim()
    .length(27, 'IBAN must be 27 characters long')
    .regex(/^IT\d{2}[A-Z0-9]{1}\d{5}\d{5}[A-Z0-9]{12}$/, 'Invalid IBAN format'),
  // passportNumber: z
  //   .string()
  //   .trim()
  //   .length(9, 'Passport Number is required')
  //   .optional(),
  passportNumber: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || val.length === 9,
      'Passport Number must be 9 characters when provided',
    )
    .optional(),
  contractPdf: z
    .instanceof(File)
    .optional() // Field is optional
    .refine((file) => !file || file?.size <= 4 * 1024 * 1024, {
      message: 'File size should be less than 4MB',
    })
    .refine(
      (file) =>
        !file ||
        file.type === 'application/pdf' ||
        (file.size === 0 && file.type === 'application/octet-stream'),
      {
        message: 'Unsupported file type, Please upload PDF',
      },
    ),
  hubId: z.coerce.number({ message: 'Hub is required' }).int().positive(),
});

export const ClientSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  taxCode: z
    .string()
    .trim()
    .length(16, 'Enter Valid Codice Fiscale (Italian Tax Code)'),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'Date of Birth is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
});

export const AdminFormSchema = z.object({
  id: z.number().optional(),
  ...SignupFormSchema.shape,
});

export const AgentFormSchema = z.object({
  ...SignupFormSchema.shape,
  ...AgentSchema.shape,
  ...AddressSchema.shape,
});

export const ClientFormSchema = z.object({
  ...SignupFormSchema.shape,
  ...ClientSchema.shape,
});

export type ClientFormState =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        dateOfBirth?: string[];
        taxCode?: string[];
        phone?: string[];
        image?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type AgentFormState =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        phone?: string[];
        image?: string[];
        email?: string[];
        password?: string[];
        assignedHub?: string[];
        dateOfBirth?: string[];
        placeOfBirth?: string[];
        taxCode?: string[];
        vatNumber?: string[];
        passportNumber?: string[];
        ibanNumber?: string[];
        contractPdf?: string[];
        addressLine1?: string[];
        addressLine2?: string[];
        union?: string[];
        city?: string[];
        state?: string[];
        postalCode?: string[];
        country?: string[];
      };
      message?: string;
    }
  | undefined;
