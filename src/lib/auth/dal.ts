import 'server-only';

import { cache } from 'react';
import db from '@/lib/database';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { decrypt } from './session';

// Verify the session and redirect to signin if it's not valid
export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId && !session?.role) {
    redirect('/login');
  }
  return { isAuth: true, userId: session.userId, role: session.role };
});

// Get the user from the session
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      columns: {
        passwordHash: false,
        isActive: false,
        createdAt: false,
        updatedAt: false,
      },
      where: (users, { eq }) => eq(users.id, Number(session.userId)),
    });

    return data.length ? data[0] : null;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});
