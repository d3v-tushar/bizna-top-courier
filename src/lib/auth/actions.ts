'use server';

import { AuthFormState } from './definitions';
import { createSession, decrypt, deleteSession } from './session';
import { SigninFormSchema, SignupFormSchema } from './validations';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { users } from '../database/schema';
import db from '../database';
import { cookies } from 'next/headers';
import { optimizeImage, uploadToS3 } from '../storage';
import { eq } from 'drizzle-orm';

export async function signup(state: AuthFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData),
  );

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { lastName, image, password } = validatedFields.data;

  try {
    // Parallelize independent async operations of image upload and password hashing
    const [imageUrl, passwordHash] = await Promise.all([
      validatedFields.data?.image
        ? uploadToS3(
            await optimizeImage(validatedFields.data?.image),
            `images/users/${Date.now() + validatedFields.data?.lastName}`,
            validatedFields.data?.image.type,
          )
        : null,
      bcrypt.hash(validatedFields.data?.password, 10),
    ]);

    // Insert into User table
    const [newUser] = await db
      .insert(users)
      .values({
        ...validatedFields.data,
        imageUrl,
        passwordHash,
      })
      .returning({ id: users.id, role: users.role });

    await createSession(newUser.id.toString(), newUser.role);
  } catch (error: any) {
    // Duplicate email
    if (error?.code === '23505' && error?.constraint === 'email_idx') {
      return { message: 'Email already in use' };
    }
    // Duplicate phone
    if (error?.code === '23505' && error?.constraint === 'phone_idx') {
      return { message: 'Phone already in use' };
    }
    // Handle other errors...
    console.error(error);
    return { message: 'Something went wrong' };
  }

  // Create a session for the new user and redirect to the home page. [NB: nextjs redirect cannot be used in trycatch block]
  redirect('/');
}

export async function signin(state: AuthFormState, formData: FormData) {
  // Verify credentials && get the user
  try {
    const validatedFields = SigninFormSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, validatedFields.data.email),
    });

    console.log('existingUser', existingUser);

    if (!existingUser) {
      return {
        errors: { email: ['No user found with this email address'] },
      };
    }

    // 3. Compare the user's password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(
      validatedFields.data.password,
      existingUser.passwordHash.trim(),
    ); // Replace with proper password verification

    console.log(passwordMatch, validatedFields.data);

    if (!passwordMatch) {
      return {
        errors: { password: ['Incorrect password'] },
      };
    }

    if (!existingUser.isActive) {
      return {
        message: 'Your has been suspended!. Please contact the administrator.',
      };
    }

    // Create the session & redirect to the home page.
    await createSession(existingUser.id.toString(), existingUser.role);
  } catch (error) {
    console.log('Error during login:', error);
    return {
      message: 'Something went wrong! Please try again later.',
    };
  }

  redirect('/');
}

export async function signout() {
  deleteSession();
  redirect('/login');
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  const payload = await decrypt(session);
  return { isAuth: true, ...payload };
}

export async function userMe() {
  try {
    const response = await fetch(`${process.env.DOMAIN}/api/v1/me`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    return { isAuth: false, data: null };
  }
}
