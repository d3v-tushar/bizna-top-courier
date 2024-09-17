'use server';
import { z } from 'zod';
import db from '../database';
import { coupons } from '../database/schema';
import { revalidatePath } from 'next/cache';
import { InsertCoupon } from '../database/schema/coupon';
import { verifySession } from '../auth/dal';

type CouponFormState =
  | {
      errors?: {
        name?: string[];
        value?: string[];
        expiredAt?: string[];
      };
      message?: string;
    }
  | undefined;

const PromoCodeSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Promo code must be at least 5 characters long' })
    .max(16, { message: 'Promo code cannot exceed 16 characters' })
    .regex(/^[A-Za-z0-9]+$/, {
      message: 'Promo code cannot contain spaces or special characters',
    }),

  value: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 25;
    },
    { message: 'Discount must be a number between 1 and 25%' },
  ),

  expiredAt: z
    .string()
    .trim()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .refine(
      (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date > new Date();
      },
      { message: 'Expiration date cannot be in the past' },
    )
    .transform((dateString) => new Date(dateString)),
});

export async function createCoupon(state: CouponFormState, formData: FormData) {
  const session = await verifySession();

  if (!session.isAuth) {
    return {
      message: 'You are not authorized to perform this action',
    };
  }

  if (session.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Unauthorized. Admin privileges Required.',
    };
  }
  const valiatedData = await PromoCodeSchema.safeParseAsync(
    Object.fromEntries(formData.entries()),
  );

  if (!valiatedData.success) {
    return {
      message: 'Validation failed',
      errors: valiatedData.error.flatten().fieldErrors,
    };
  }

  const couponData: InsertCoupon = valiatedData.data;

  try {
    await db.insert(coupons).values(couponData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      };
    }

    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'idx_coupons_code':
              return { message: 'Promo already exist' };
            default:
              return { message: 'Something went wrong!' };
          }
        }
      }

      // Log the full error for debugging, but don't expose it to the client
      console.error('Detailed error:', error);
    }

    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }

  revalidatePath('/promo');
  return {
    message: 'Promo created successfully!',
  };
}
