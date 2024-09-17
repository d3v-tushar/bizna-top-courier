'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from '../auth/dal';
import db from '../database';
import { deliveryOption, deliveryZone } from '../database/schema';
import {
  deliveryOptionSchema,
  deliveryZoneSchema,
} from './delivery.validations';
import { eq } from 'drizzle-orm';

// export async function createDeliveryZone(
//   formSate:
//     | {
//         message: string;
//         fields?: Record<string, string>;
//         issues?: string[];
//       }
//     | undefined,
//   formData: FormData,
// ) {
//   const session = await verifySession();
//   if (!session.isAuth) {
//     return {
//       message: 'You are not authorized to perform this action',
//     };
//   }

//   if (session.role !== 'ADMIN') {
//     return {
//       success: false,
//       message: 'Unauthorized. Admin privileges Required.',
//     };
//   }

//   const validatedFields = deliveryZoneSchema.safeParse(
//     Object.fromEntries(formData.entries()),
//   );

//   if (!validatedFields.success) {
//     const fields: Record<string, string> = {};
//     for (const key of Object.keys(formData)) {
//       fields[key] = Object.fromEntries(formData)[key].toString();
//     }
//     return {
//       message: 'Validation Failed! Invalid Data.',
//       fields,
//       issues: validatedFields.error.issues.map((issue) => issue.message),
//     };
//   }

//   try {
//     await db.insert(deliveryZone).values(validatedFields.data);
//   } catch (error) {
//     console.error('Error creating delivery zone:', error);
//     if (error instanceof Error) {
//       if ('code' in error && 'constraint' in error) {
//         const dbError = error as Error & { code: string; constraint: string };
//         if (dbError.code === '23505') {
//           switch (dbError.constraint) {
//             case 'zone_name_idx':
//               return { message: 'Delivery zone already exists!' };
//             default:
//               return { message: 'A unique constraint was violated' };
//           }
//         }
//       }
//     }
//     return {
//       message: 'An unexpected error occurred. Please try again later.',
//     };
//   }

//   revalidatePath('/delivery');
// }

// export async function createDeliveryOption(
//   formSate:
//     | {
//         message: string;
//         fields?: Record<string, string>;
//         issues?: string[];
//       }
//     | undefined,
//   formData: FormData,
// ) {
//   const session = await verifySession();
//   if (!session.isAuth) {
//     return {
//       message: 'You are not authorized to perform this action',
//     };
//   }

//   if (session.role !== 'ADMIN') {
//     return {
//       success: false,
//       message: 'Unauthorized. Admin privileges Required.',
//     };
//   }

//   const validatedFields = deliveryOptionSchema.safeParse(
//     Object.fromEntries(formData.entries()),
//   );

//   if (!validatedFields.success) {
//     const fields: Record<string, string> = {};
//     for (const key of Object.keys(formData)) {
//       fields[key] = Object.fromEntries(formData)[key].toString();
//     }
//     return {
//       message: 'Validation Failed! Invalid Data.',
//       fields,
//       issues: validatedFields.error.issues.map((issue) => issue.message),
//     };
//   }

//   try {
//     await db.insert(deliveryOption).values(validatedFields.data);
//   } catch (error) {
//     console.error('Error creating delivery option:', error);
//     if (error instanceof Error) {
//       if ('code' in error && 'constraint' in error) {
//         const dbError = error as Error & { code: string; constraint: string };
//         if (dbError.code === '23505') {
//           switch (dbError.constraint) {
//             case 'option_name_idx':
//               return { message: 'Delivery option already exists!' };
//             default:
//               return { message: 'A unique constraint was violated' };
//           }
//         }
//       }
//     }
//     return {
//       message: 'An unexpected error occurred. Please try again later.',
//     };
//   }

//   revalidatePath('/delivery');
// }

export async function updateDeliveryZone(
  zoneId: number,
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

  const validatedFields = deliveryZoneSchema.safeParse(
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
    await db
      .update(deliveryZone)
      .set(validatedFields.data)
      .where(eq(deliveryZone.id, zoneId));
  } catch (error) {
    console.error('Error updating delivery zone:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'zone_name_idx':
              return { message: 'Delivery zone name already exists!' };
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

  revalidatePath('/delivery');
}

export async function updateDeliveryOption(
  optionId: number,
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

  const validatedFields = deliveryOptionSchema.safeParse(
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
    await db
      .update(deliveryOption)
      .set(validatedFields.data)
      .where(eq(deliveryOption.id, optionId));
  } catch (error) {
    console.error('Error updating delivery option:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'option_name_idx':
              return { message: 'Delivery option name already exists!' };
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

  revalidatePath('/delivery');
}

// export async function deleteDeliveryZone(
//   zoneId: number,
// ): Promise<{ success: boolean; message: string }> {
//   try {
//     const session = await verifySession();
//     if (!session) {
//       return { success: false, message: 'Authentication Required.' };
//     }
//     if (session.role !== 'ADMIN') {
//       return {
//         success: false,
//         message: 'Unauthorized. Admin privileges Required.',
//       };
//     }

//     await db.delete(deliveryZone).where(eq(deliveryZone.id, zoneId));
//   } catch (error) {
//     console.log(error);
//     return { success: false, message: 'Something went wrong!' };
//   }
//   revalidatePath('/delivery');
//   return {
//     success: true,
//     message: 'Delivery Zone Deleted Successfully',
//   };
// }

// export async function deleteDeliveryOption(
//   optionId: number,
// ): Promise<{ success: boolean; message: string }> {
//   try {
//     const session = await verifySession();
//     if (!session) {
//       return { success: false, message: 'Authentication Required.' };
//     }
//     if (session.role !== 'ADMIN') {
//       return {
//         success: false,
//         message: 'Unauthorized. Admin privileges Required.',
//       };
//     }

//     await db.delete(deliveryOption).where(eq(deliveryOption.id, optionId));
//   } catch (error) {
//     console.log(error);
//     return { success: false, message: 'Something went wrong!' };
//   }
//   revalidatePath('/delivery');
//   return {
//     success: true,
//     message: 'Delivery Option Deleted Successfully',
//   };
// }

// Todo: Will be replaced
// Temporary Actions

export async function createDeliveryZone(formData: FormData) {
  const session = await verifySession();
  if (!session.isAuth) {
    return {
      message: 'You are not authorized to perform this action',
    };
  }

  if (session.role !== 'ADMIN') {
    return {
      message: 'Unauthorized. Admin privileges Required.',
    };
  }

  const validatedFields = deliveryZoneSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  console.log('validatedFields', Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Validation Failed! Invalid Data.',
    };
  }

  try {
    await db.insert(deliveryZone).values(validatedFields.data);
  } catch (error) {
    console.error('Error creating delivery zone:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'zone_name_idx':
              return { message: 'Delivery zone already exists!' };
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

  revalidatePath('/delivery');
}

export async function createDeliveryOption(zoneId: number, formData: FormData) {
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

  const validatedFields = deliveryOptionSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      message: 'Validation Failed! Invalid Data.',
    };
  }

  try {
    await db
      .insert(deliveryOption)
      .values({ ...validatedFields.data, deliveryZoneId: zoneId });
  } catch (error) {
    console.error('Error creating delivery option:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'option_name_idx':
              return { message: 'Delivery option already exists!' };
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

  revalidatePath('/delivery');
}

export async function deleteDeliveryZone(
  zoneId: number,
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

    await db.delete(deliveryZone).where(eq(deliveryZone.id, zoneId));
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong!' };
  }
  revalidatePath('/delivery');
  return {
    success: true,
    message: 'Delivery Zone Deleted Successfully',
  };
}

export async function deleteDeliveryOption(
  optionId: number,
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

    await db.delete(deliveryOption).where(eq(deliveryOption.id, optionId));
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong!' };
  }
  revalidatePath('/delivery');
  return {
    success: true,
    message: 'Delivery Option Deleted Successfully',
  };
}
