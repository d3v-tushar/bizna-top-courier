'use server';

import db from '../database';
import { cargoItem } from '../database/schema';
import { revalidatePath } from 'next/cache';
import { verifySession } from '../auth/dal';
import { cargoFormSchema } from './cargo.validations';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function createCargoItem(
  formSate:
    | {
        message: string;
        fields?: Record<string, string>;
        issues?: string[];
      }
    | undefined,
  formData: FormData,
) {
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

  const validatedFields = cargoFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = Object.fromEntries(formData)[key].toString();
    }
    return {
      message: 'Validation Failed! Invalid Data.',
      fields,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db.insert(cargoItem).values(validatedFields.data);
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'cargo_name_idx':
              return { message: 'Cargo Item with this name already exist' };
            default:
              return { message: 'A unique constraint was violated' };
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
  revalidatePath('/cargo');
  redirect('/cargo');
}

export async function updateCargoItem(
  itemId: number,
  formSate:
    | {
        message: string;
        fields?: Record<string, string>;
        issues?: string[];
      }
    | undefined,
  formData: FormData,
) {
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

  const validatedFields = cargoFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  console.log('raw data', Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = Object.fromEntries(formData)[key].toString();
    }
    return {
      message: 'Validation Failed! Invalid Data.',
      fields,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  console.log(validatedFields.data);

  try {
    await db
      .update(cargoItem)
      .set(validatedFields.data)
      .where(eq(cargoItem.id, itemId));
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'cargo_name_idx':
              return { message: 'Cargo Item with this name already exist' };
            default:
              return { message: 'A unique constraint was violated' };
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
  revalidatePath('/cargo');
  redirect('/cargo');
}

export async function deleteCargoItem(
  itemId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await verifySession();
    if (!session) {
      return { success: false, message: 'Authentication Required.' };
    }
    if (session.role !== 'ADMIN') {
      return {
        success: false,
        message: 'Unauthorized. Admin privileges Required.',
      };
    }

    await db.delete(cargoItem).where(eq(cargoItem.id, itemId));
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong!' };
  }
  revalidatePath('/cargo');
  return {
    success: true,
    message: 'Cargo Item Deleted Successfully',
  };
}
