import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/lib/auth/definitions';
import { redirect } from 'next/navigation';

// const secretKey = process.env.SESSION_SECRET;
const secretKey = 'OUsnVMDM6hZ8chR7o9SkyPCBL5MAMXgfrlYCpWnzJjs';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// Create a stateless session also set a cookie with the userId role and expiresAt. (Use Database session in production)
export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
  const session = await encrypt({ userId, role, expiresAt });

  // Set the session cookie
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

// Get the session from the cookie and verify it. (Use Database session in production)
export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

// Update the session cookie with a new expiration time. (Use Database session in production)
export async function updateSession() {
  const session = cookies().get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

// Delete the session cookie and redirect to signin
export function deleteSession() {
  cookies().delete('session');
  redirect('/login');
}

// // Verify the session and redirect to signin if it's not valid
// export const verifySession = cache(async () => {
//   const cookie = cookies().get('session')?.value;
//   const session = await decrypt(cookie);

//   if (!session?.userId && !session?.role) {
//     redirect('/login');
//   }
//   return { isAuth: true, userId: session.userId, role: session.role };
// });

// // Get the user from the session
// export const getUser = cache(async () => {
//   const session = await verifySession();
//   if (!session) return null;

//   try {
//     const data = await db.query.users.findMany({
//       columns: {
//         isActive: false,
//         createdAt: false,
//         updatedAt: false,
//       },
//       where: (users, { eq }) => eq(users.id, Number(session.userId)),
//     });

//     return data.length ? data[0] : null;
//   } catch (error) {
//     console.log('Failed to fetch user');
//     return null;
//   }
// });
