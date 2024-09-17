'use server';

import { SignupFormSchema } from '../auth/validations';
import db from '../database';
import { hash } from 'bcrypt';
import { admins, agents, users, address, clients } from '../database/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import {
  AdminFormSchema,
  AgentFormSchema,
  AgentFormState,
  ClientFormSchema,
  UserFormSchema,
} from './user.validations';
import { optimizeImage, uploadToS3 } from '../storage';
import { InsertAgent } from '../database/schema/agent';
import { redirect } from 'next/navigation';
import { verifySession } from '../auth/dal';
import { eq } from 'drizzle-orm';

export async function createAdmin(
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

  const validatedFields = SignupFormSchema.safeParse(
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

  const { firstName, lastName, phone, image, email, password } =
    validatedFields.data;

  try {
    const [imageUrl, passwordHash] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + firstName + '_' + lastName}`,
            image.type,
          )
        : null,
      hash(password, 10),
    ]);

    await db.transaction(async (tx) => {
      const user = await tx
        .insert(users)
        .values({
          firstName,
          lastName,
          phone,
          imageUrl,
          email,
          passwordHash,
          role: 'ADMIN',
        })
        .returning({ id: users.id });

      await tx.insert(admins).values({
        userId: user[0].id,
      });
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
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

  revalidatePath('/users/admins');
  redirect('/users/admins');
}

export async function createAgentAction(
  state: AgentFormState,
  formData: FormData,
) {
  try {
    const session = await verifySession();
    if (!session.isAuth && session.role !== 'ADMIN') {
      return {
        message: 'You are not authorized to perform this action',
      };
    }

    const validatedFields = AgentFormSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    console.log(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
      return {
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    const {
      firstName,
      lastName,
      phone,
      image,
      email,
      password,
      contractPdf: contractPdfFile,
      passportNumber,
      taxCode,
      vatNumber,
      dateOfBirth,
      placeOfBirth,
      iban,
      hubId,
      addressLine1,
      addressLine2,
      union,
      city,
      state,
      postalCode,
      country,
    } = validatedFields.data;
    const [imageUrl, passwordHash, contractPdf] = await Promise.all([
      image
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName}`,
            image.type,
          )
        : null,
      hash(password, 10),
      contractPdfFile
        ? uploadToS3(
            Buffer.from(await contractPdfFile.arrayBuffer()),
            `documents/contract-paper/${Date.now() + lastName}`,
            contractPdfFile.type,
          )
        : null,
    ]);
    await db.transaction(async (tx) => {
      const [agentUser] = await tx
        .insert(users)
        .values({
          firstName,
          lastName,
          phone,
          imageUrl,
          email,
          passwordHash,
          role: 'AGENT',
        })
        .returning({ id: users.id });
      const [agentAddress] = await tx
        .insert(address)
        .values({
          addressLine1,
          addressLine2,
          union,
          city,
          state,
          postalCode,
          country,
        })
        .returning({ id: address.id });
      const agentPayload: InsertAgent = {
        userId: agentUser.id,
        addressId: agentAddress.id,
        contractPdf,
        taxCode,
        vatNumber,
        passportNumber,
        dateOfBirth,
        placeOfBirth,
        iban,
        hubId,
      };
      await tx.insert(agents).values(agentPayload);
    });
    revalidatePath('/users/agents');
    return {
      success: true,
      message: 'Agent created successfully',
    };
  } catch (error) {
    console.error('Error creating agent:', error);
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
            case 'email_idx':
              return { success: false, message: 'Email already in use' };
            case 'phone_idx':
              return { success: false, message: 'Phone number already in use' };
            case 'vat_number_idx':
              return { success: false, message: 'VAT number already in use' };
            case 'agent_tax_idx':
              return { success: false, message: 'Tax code already in use' };
            case 'passport_number_idx':
              return {
                success: false,
                message: 'Passport number already in use',
              };
            case 'iban_idx':
              return { success: false, message: 'IBAN already in use' };
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
}

export async function createAgent(
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
  if (!session.isAuth && session.role !== 'ADMIN') {
    return {
      message: 'You are not authorized to perform this action',
    };
  }

  const validatedFields = AgentFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = Object.fromEntries(formData)[key].toString();
    }
    return {
      message: 'Validation Failed! Invalid Agent Data.',
      fields,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  const {
    firstName,
    lastName,
    phone,
    image,
    email,
    password,
    vatNumber,
    taxCode,
    dateOfBirth,
    placeOfBirth,
    iban,
    passportNumber,
    contractPdf,
    hubId,
    addressLine1,
    addressLine2,
    union,
    city,
    state,
    postalCode,
    country,
  } = validatedFields.data;

  try {
    const [imageUrl, passwordHash, contractPdfUrl] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName + '_' + firstName}`,
            image.type,
          )
        : null,
      hash(password, 10),
      contractPdf && contractPdf.size > 0
        ? uploadToS3(
            Buffer.from(await contractPdf.arrayBuffer()),
            `documents/contract-paper/${Date.now() + firstName + '_' + lastName}`,
            contractPdf.type,
          )
        : null,
    ]);

    await db.transaction(async (tx) => {
      const [agentUser] = await tx
        .insert(users)
        .values({
          firstName,
          lastName,
          phone,
          imageUrl,
          email,
          passwordHash,
          role: 'AGENT',
        })
        .returning({ id: users.id });

      const [agentAddress] = await tx
        .insert(address)
        .values({
          addressLine1,
          addressLine2,
          union,
          city,
          state,
          postalCode,
          country,
        })
        .returning({ id: address.id });

      await tx.insert(agents).values({
        userId: agentUser.id,
        addressId: agentAddress.id,
        contractPdf: contractPdfUrl,
        taxCode,
        vatNumber,
        passportNumber,
        dateOfBirth,
        placeOfBirth,
        iban,
        hubId,
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
            case 'vat_number_idx':
              return { message: 'VAT number already in use' };
            case 'agent_tax_idx':
              return { message: 'Tax code already in use' };
            case 'passport_number_idx':
              return {
                message: 'Passport number already in use',
              };
            case 'iban_idx':
              return { message: 'IBAN already in use' };
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
  revalidatePath('/users/agents');
  redirect('/users/agents');
}

export async function createClient(
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

  const validatedFields = ClientFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = Object.fromEntries(formData)[key].toString();
    }
    return {
      message: 'Validation Failed! Invalid Agent Data.',
      fields,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  const {
    firstName,
    lastName,
    phone,
    image,
    email,
    password,
    taxCode,
    dateOfBirth,
  } = validatedFields.data;

  try {
    const [imageUrl, passwordHash] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName + '_' + firstName}`,
            image.type,
          )
        : null,
      hash(password, 10),
    ]);

    await db.transaction(async (tx) => {
      const user = await tx
        .insert(users)
        .values({
          firstName,
          lastName,
          phone,
          imageUrl,
          email,
          passwordHash,
          role: 'CLIENT',
        })
        .returning({ id: users.id });

      await tx.insert(clients).values({
        userId: user[0].id,
        taxCode,
        dateOfBirth,
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
            case 'tax_code_idx':
              return { message: 'Tax code already in use' };
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
  revalidatePath('/users/clients');
  redirect('/users/clients');
}

export async function updateUser(
  userId: number,
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

  const validatedFields = UserFormSchema.omit({
    password: true,
  })
    .extend({
      password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
          message: 'Contain at least one special character.',
        })
        .trim()
        .optional()
        .or(z.literal('')),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  console.log(validatedFields);
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

  const { firstName, lastName, phone, image, email, password, isActive } =
    validatedFields.data;

  try {
    const [imageUrl, passwordHash] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName + '_' + firstName}`,
            image.type,
          )
        : null,
      password ? hash(password, 10) : null,
    ]);

    await db
      .update(users)
      .set({
        firstName,
        lastName,
        phone,
        imageUrl: imageUrl || undefined,
        email,
        ...(passwordHash && { passwordHash }),
        isActive,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
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

  revalidatePath('/account');
  redirect('/account');
}

export async function updateAdmin(
  userId: number,
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
      message: 'Unauthorized. Admin privileges Required.',
    };
  }

  const validatedFields = AdminFormSchema.omit({
    password: true,
  })
    .extend({
      password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
          message: 'Contain at least one special character.',
        })
        .trim()
        .optional()
        .or(z.literal('')),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  console.log('admin update', validatedFields);

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

  const { firstName, lastName, phone, image, email, password } =
    validatedFields.data;

  try {
    const [imageUrl, passwordHash] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName + '_' + firstName}`,
            image.type,
          )
        : null,
      password ? hash(password, 10) : null,
    ]);

    await db.transaction(async (tx) => {
      // Update user
      await tx
        .update(users)
        .set({
          firstName,
          lastName,
          phone,
          imageUrl: imageUrl || undefined,
          email,
          ...(passwordHash && { passwordHash }),
        })
        .where(eq(users.id, userId));
    });
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
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

  revalidatePath('/users/admins');
  redirect('/users/admins');
}

export async function updateAgent(
  userId: number,
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

  const validatedFields = AgentFormSchema.omit({
    password: true,
  })
    .extend({
      password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
          message: 'Contain at least one special character.',
        })
        .trim()
        .optional()
        .or(z.literal('')),
    })
    .safeParse(Object.fromEntries(formData.entries()));

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

  const {
    firstName,
    lastName,
    phone,
    image,
    email,
    password,
    vatNumber,
    taxCode,
    dateOfBirth,
    placeOfBirth,
    iban,
    passportNumber,
    contractPdf,
    hubId,
    addressLine1,
    addressLine2,
    union,
    city,
    state,
    postalCode,
    country,
  } = validatedFields.data;

  try {
    const [imageUrl, passwordHash, contractPdfUrl] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName + '_' + firstName}`,
            image.type,
          )
        : null,
      password ? hash(password, 10) : null,
      contractPdf && contractPdf.size > 0
        ? uploadToS3(
            Buffer.from(await contractPdf.arrayBuffer()),
            `documents/contract-paper/${Date.now() + firstName + '_' + lastName}`,
            contractPdf.type,
          )
        : null,
    ]);

    await db.transaction(async (tx) => {
      // Update user
      await tx
        .update(users)
        .set({
          firstName,
          lastName,
          phone,
          imageUrl: imageUrl || undefined,
          email,
          ...(passwordHash && { passwordHash }),
        })
        .where(eq(users.id, userId));

      // Fetch agent and address IDs
      const agent = await tx.query.agents.findFirst({
        where: eq(agents.userId, userId),
        columns: {
          id: true,
          addressId: true,
        },
      });

      if (!agent) {
        throw new Error('Agent not found');
      }

      // Update address
      await tx
        .update(address)
        .set({
          addressLine1,
          addressLine2,
          union,
          city,
          state,
          postalCode,
          country,
        })
        .where(eq(address.id, agent.addressId));

      // Update agent
      await tx
        .update(agents)
        .set({
          contractPdf: contractPdfUrl || undefined,
          taxCode,
          vatNumber,
          passportNumber,
          dateOfBirth,
          placeOfBirth,
          iban,
          hubId,
        })
        .where(eq(agents.id, agent.id));
    });
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
            case 'vat_number_idx':
              return { message: 'VAT number already in use' };
            case 'agent_tax_idx':
              return { message: 'Tax code already in use' };
            case 'passport_number_idx':
              return {
                message: 'Passport number already in use',
              };
            case 'iban_idx':
              return { message: 'IBAN already in use' };
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

  revalidatePath('/users/agents');
  redirect('/users/agents');
}

export async function updateClient(
  userId: number,
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

  const validatedFields = ClientFormSchema.omit({
    password: true,
  })
    .extend({
      password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
          message: 'Contain at least one special character.',
        })
        .trim()
        .optional()
        .or(z.literal('')),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  console.log('client update', validatedFields);

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

  const {
    firstName,
    lastName,
    phone,
    image,
    email,
    password,
    taxCode,
    dateOfBirth,
  } = validatedFields.data;

  try {
    const [imageUrl, passwordHash] = await Promise.all([
      image && image.size > 0
        ? uploadToS3(
            await optimizeImage(image),
            `images/users/${Date.now() + lastName + '_' + firstName}`,
            image.type,
          )
        : null,
      password ? hash(password, 10) : null,
    ]);

    await db.transaction(async (tx) => {
      // Update user
      await tx
        .update(users)
        .set({
          firstName,
          lastName,
          phone,
          imageUrl: imageUrl || undefined,
          email,
          ...(passwordHash && { passwordHash }),
        })
        .where(eq(users.id, userId));

      await tx
        .update(clients)
        .set({
          taxCode,
          dateOfBirth,
        })
        .where(eq(clients.userId, userId));
    });
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && 'constraint' in error) {
        const dbError = error as Error & { code: string; constraint: string };
        if (dbError.code === '23505') {
          switch (dbError.constraint) {
            case 'email_idx':
              return { message: 'Email already in use' };
            case 'phone_idx':
              return { message: 'Phone number already in use' };
            case 'tax_code_idx':
              return { message: 'Tax code already in use' };
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

  revalidatePath('/users/clients');
  redirect('/users/clients');
}

export async function deleteAdmin(
  userId: number,
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

    if (Number(session.userId) === userId) {
      return {
        success: false,
        message: 'Cannot Delete Own Admin Account.',
      };
    }

    if (1 === userId) {
      return {
        success: false,
        message: 'Cannot Delete Root Admin Account.',
      };
    }

    await db.transaction(async (tx) => {
      await tx.delete(admins).where(eq(admins.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong!' };
  }
  revalidatePath('/users/admins');
  return {
    success: true,
    message: 'Admin Deleted Successfully',
  };
}

export async function deleteAgent(
  userId: number,
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

    await db.transaction(async (tx) => {
      await tx.delete(agents).where(eq(agents.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });
  } catch (error) {
    console.error('Error in deleteAgent:', error);

    if (error instanceof Error) {
      if ('code' in error && typeof error.code === 'string') {
        switch (error.code) {
          case '23503': // Foreign key constraint violation
            return {
              success: false,
              message:
                'Cannot delete agent due to associated records. Please remove related data first.',
            };
          case '23505': // Unique constraint violation
            return {
              success: false,
              message:
                'A unique constraint was violated. The agent might have already been deleted.',
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
  revalidatePath('/users/agents');
  return {
    success: true,
    message: 'Agent Deleted Successfully',
  };
}

export async function deleteClient(
  userId: number,
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

    await db.transaction(async (tx) => {
      await tx.delete(clients).where(eq(clients.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });
  } catch (error) {
    console.error('Error in deleteAgent:', error);

    if (error instanceof Error) {
      if ('code' in error && typeof error.code === 'string') {
        switch (error.code) {
          case '23503': // Foreign key constraint violation
            return {
              success: false,
              message:
                'Cannot delete agent due to associated records. Please remove related data first.',
            };
          case '23505': // Unique constraint violation
            return {
              success: false,
              message:
                'A unique constraint was violated. The agent might have already been deleted.',
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
  revalidatePath('/users/clients');
  return {
    success: true,
    message: 'Client Deleted Successfully',
  };
}

export async function suspendUser(
  userId: number,
  status: boolean,
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
    await db
      .update(users)
      .set({ isActive: !status })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error('Error suspending user:', error);
    return {
      success: false,
      message: 'Error suspending user',
    };
  }
  revalidatePath('/users');
  return {
    success: true,
    message: `User ${status ? 'Suspended' : 'Reactivated'} Successfully`,
  };
}
