import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/auth/session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/find-hub',
  '/tracking',
  '/privacy',
  '/~offline',
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = !publicRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Allowing Service Worker to be accessed from any origin
  if (path === '/api/v1/invoice/stream') {
    return NextResponse.next();
  }

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  console.log('session from middleware', session);

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    console.log('Block 5', session?.userId, session?.role);
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 6. Redirect to /overview if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    ['ADMIN', 'AGENT'].includes(session?.role as string)
  ) {
    console.log('Block 6', session?.userId, session?.role);
    return NextResponse.redirect(new URL('/overview', req.nextUrl));
  }

  // 6. Redirect to /overview if the client is authenticated
  if (isPublicRoute && session?.userId && session.role === 'CLIENT') {
    console.log('Block 7', session?.userId, session?.role);
    return NextResponse.redirect(new URL('/my-packages', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.js$|manifest\\.json$|assets/map\\.svg$|icons$|api/v1/hubs$|~.*).*)',
//   ],
// };

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.js$|.*\\.json$|manifest\\.webmanifest$|assets/map\\.svg$|icons$|api/v1/hubs$|~.*).*)',
  ],
};
