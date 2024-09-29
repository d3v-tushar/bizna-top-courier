import db from '@/lib/database';
import { address, admins, hubs, users } from '@/lib/database/schema';
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
          email: 'md.mohsinahmed@outlook.com',
          passwordHash:
            '$2y$10$/SOxNQ/rt0utntcaPF366O02.OkVKatvzmNg3wZahAZooz8k7/SC6',
          role: 'ADMIN',
        })
        .returning({ id: users.id });

      await tx.insert(admins).values({
        userId: adminUser.id,
      });

      const [hubAddress] = await tx
        .insert(address)
        .values({
          addressLine1:
            '104, Crescent Road (Ground Floor), Kathalbagan, Dhanmondi, Dhaka-1205',
          city: 'Dhaka',
          state: 'Dhaka Division',
          postalCode: '1205',
          country: 'Bangladesh',
        })
        .returning({ id: address.id });

      await tx.insert(hubs).values({
        name: 'Dhaka Central Hub',
        addressId: hubAddress.id,
        latitude: '23.745568068167014',
        longitude: '90.38823329642517',
      });
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
