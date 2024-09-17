import db from '@/lib/database';
import { admins, users } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const SECRET_KEY = 'BIZNA';

export async function POST(request: Request) {
  // Check for the secret key in the headers
  const secretKey = request.headers.get('X-Admin-Secret-Key');

  if (secretKey !== SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.transaction(async (tx) => {
      const [adminUser] = await tx
        .insert(users)
        .values({
          firstName: 'Root',
          lastName: 'Admin',
          phone: '01728712523',
          imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('Root')}+${encodeURIComponent('Admin')}`,
          email: 'root@biznatop.com',
          passwordHash:
            '$2a$10$T4ZG9VTjr2dqGaBeossv..0VSzayD2fDLwZiy3RQ4vKXE1Jv6mzgK',
          role: 'ADMIN',
        })
        .returning({ id: users.id });

      await tx.insert(admins).values({
        userId: adminUser.id,
      });

      return adminUser;
    });

    // Return the result
    return NextResponse.json(
      { message: 'Admin created successfully' },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If it's a validation error, return the error messages
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // For any other error, log it and return a generic error message
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 },
    );
  }
}
