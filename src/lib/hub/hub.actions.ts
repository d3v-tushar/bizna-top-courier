'use server';

import { z } from 'zod';
import db from '@/lib/database';
import { HubFormSchema } from './hub.validations';
import { address, hubs } from '@/lib/database/schema';
import { revalidatePath } from 'next/cache';
import { verifySession } from '../auth/dal';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

// export async function createHub(payload: z.infer<typeof HubFormSchema>) {
//   try {
//     const { address: hubAddress, ...hubData } = HubFormSchema.parse(payload);

//     const [newAddress] = await db
//       .insert(address)
//       .values(hubAddress)
//       .returning({ id: address.id });

//     const [newHub] = await db
//       .insert(hubs)
//       .values({ ...hubData, addressId: newAddress.id })
//       .returning();

//     revalidatePath('/hubs');
//     return {
//       success: true,
//       message: 'Hub Created Successfully',
//       data: newHub,
//     };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         message: error.errors[0].message,
//       };
//     }

//     if (error instanceof Error) {
//       if ('code' in error && 'constraint' in error) {
//         const dbError = error as Error & { code: string; constraint: string };
//         if (dbError.code === '23505') {
//           switch (dbError.constraint) {
//             case 'hub_name_idx':
//               return {
//                 success: false,
//                 message: 'Hub this name already exists',
//               };
//           }
//         }
//       }
//     }

//     // Fallback error message
//     return {
//       success: false,
//       message: 'An unexpected error occurred',
//     };
//   }
// }

// export async function createHub(payload: z.infer<typeof HubFormSchema>) {
//   try {
//     const validatedData = HubFormSchema.parse(payload);
//     const { address: hubAddress, ...hubData } = validatedData;

//     const result = await db.transaction(async (tx) => {
//       // Insert address
//       const [newAddress] = await tx
//         .insert(address)
//         .values(hubAddress)
//         .returning({ id: address.id });

//       // Insert hub
//       const [newHub] = await tx
//         .insert(hubs)
//         .values({ ...hubData, addressId: newAddress.id })
//         .returning();

//       return newHub;
//     });

//     revalidatePath('/hubs');

//     return {
//       success: true,
//       message: 'Hub Created Successfully',
//       data: result,
//     };
//   } catch (error) {
//     console.error('Error creating hub:', error);

//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         message: error.errors[0].message,
//       };
//     }

//     if (error instanceof Error) {
//       if ('code' in error && 'constraint' in error) {
//         const dbError = error as Error & { code: string; constraint: string };
//         if (dbError.code === '23505') {
//           switch (dbError.constraint) {
//             case 'hub_name_idx':
//               return {
//                 success: false,
//                 message: 'A hub with this name already exists',
//               };
//           }
//         }
//       }
//       // Log the full error for debugging, but don't expose it to the client
//       console.error('Detailed error:', error);
//     }

//     // Fallback error message
//     return {
//       success: false,
//       message: 'An unexpected error occurred',
//     };
//   }
// }

export async function createHub(
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

  const validatedFields = HubFormSchema.safeParse(
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

  const { name, isActive, latitude, longitude, ...hubAddress } =
    validatedFields.data;

  try {
    await db.transaction(async (tx) => {
      const addr = await tx
        .insert(address)
        .values(hubAddress)
        .returning({ id: address.id });

      await tx.insert(hubs).values({
        name,
        latitude,
        longitude,
        isActive,
        addressId: addr[0].id,
      });
    });
  } catch (error) {
    console.error('Error creating hub:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'hub_name_idx':
              return { message: 'Hub name already in use' };
            default:
              return { message: 'A unique constraint was violated' };
          }
        }
      }
    }
    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }

  revalidatePath('/hubs');
  redirect('/hubs');
}

export async function updateHub(
  hubId: number,
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

  const validatedFields = HubFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  console.log(Object.fromEntries(formData.entries()));

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

  const { name, isActive, latitude, longitude, ...hubAddress } =
    validatedFields.data;

  try {
    await db.transaction(async (tx) => {
      const hub = await tx
        .update(hubs)
        .set({
          name,
          latitude,
          longitude,
          isActive,
        })
        .where(eq(hubs.id, hubId))
        .returning({ addressId: hubs.addressId });

      await tx
        .update(address)
        .set({
          addressLine1: hubAddress.addressLine1,
          addressLine2: hubAddress.addressLine2,
          union: hubAddress.union,
          city: hubAddress.city,
          state: hubAddress.state,
          postalCode: hubAddress.postalCode,
          country: hubAddress.country,
        })
        .where(eq(address.id, hub[0].addressId));
    });
  } catch (error) {
    console.error('Error updating hub:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'hub_name_idx':
              return { message: 'Hub name already in use' };
            default:
              return { message: 'A unique constraint was violated' };
          }
        }
      }
    }
    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }

  revalidatePath('/hubs');
  redirect('/hubs');
}

export async function deleteHub(hubId: number) {
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
    await db.delete(hubs).where(eq(hubs.id, hubId));
  } catch (error) {
    console.error('Error in deleteAgent:', error);

    if (error instanceof Error) {
      if ('code' in error && typeof error.code === 'string') {
        switch (error.code) {
          case '23503': // Foreign key constraint violation
            return {
              success: false,
              message:
                'Cannot delete hub due to associated records. Please remove related data first.',
            };
          case '23505': // Unique constraint violation
            return {
              success: false,
              message:
                'A unique constraint was violated. The hub might have already been deleted.',
            };
          default:
            return {
              success: false,
              message: `Database error occurred: ${error.code}`,
            };
        }
      }
    }

    return { success: false, message: 'Something went wrong!' };
  }

  revalidatePath('/hubs');
  return {
    success: true,
    message: 'Hub Deleted Successfully',
  };
}
