'use server';

import { verifySession } from '../auth/dal';
import db from '../database';
import { address, agents, packages, party } from '../database/schema';
import { packageItem } from '../database/schema/package';
import { generateBarcode } from '../utils';
import {
  PackageFormSchema,
  PackageLogSchema,
  PackageUpdateSchema,
} from './package.validations';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function validatePromoCode(code: string) {
  const session = await verifySession();
  if (!session) {
    return { success: false, message: 'Authentication Required.' };
  }
  if (session.role !== 'AGENT') {
    return {
      success: false,
      message: 'Unauthorized. Agent privileges Required.',
    };
  }
  const promo = await db.query.coupons.findFirst({
    where: (coupon, { and, eq, gt }) =>
      and(eq(coupon.name, code), gt(coupon.expiredAt, new Date())),
  });

  return {
    success: true,
    message: 'Promo Code Valid',
    data: promo,
  };
}

export async function createPackage(
  payload: z.infer<typeof PackageFormSchema>,
) {
  const session = await verifySession();

  if (!session.isAuth && session.role !== 'AGENT') {
    return { success: false, message: 'Unauthorized User Request' };
  }

  try {
    const {
      sender,
      receiver,
      billingAddress,
      shippingAddress,
      lineItems,
      package: packageData,
    } = PackageFormSchema.parse(payload);

    const insertedPackage = await db.transaction(async (tx) => {
      const [
        loggedAgent,
        newSender,
        newReceiver,
        newBillingAddress,
        newShippingAddress,
      ] = await Promise.all([
        tx.query.agents.findFirst({
          columns: { id: true },
          with: { hub: { columns: { id: true } } },
          where: eq(agents.userId, Number(session.userId)),
        }),
        tx
          .insert(party)
          .values({ ...sender, type: 'SENDER' })
          .returning({ id: party.id }),
        tx
          .insert(party)
          .values({ ...receiver, type: 'RECEIVER' })
          .returning({ id: party.id }),
        tx.insert(address).values(billingAddress).returning({ id: address.id }),
        tx
          .insert(address)
          .values(shippingAddress)
          .returning({ id: address.id }),
      ]);

      if (!loggedAgent || !loggedAgent.hub) {
        throw new Error('Agent or Hub not found');
      }

      const validPackageData = {
        ...packageData,
        totalAmount: packageData.totalAmount as string,
        barcode: generateBarcode(),
        sourceHubId: loggedAgent.hub.id,
        agentId: loggedAgent.id,
        senderId: newSender[0].id,
        receiverId: newReceiver[0].id,
        billingAddressId: newBillingAddress[0].id,
        shippingAddressId: newShippingAddress[0].id,
      };

      const [newPackage] = await tx
        .insert(packages)
        .values(validPackageData)
        .returning({ id: packages.id });

      const packageItems = lineItems.map((item) => ({
        packageId: newPackage.id,
        ...item,
      }));

      await tx.insert(packageItem).values(packageItems);

      return newPackage;
    });

    revalidatePath('/packages');
    return {
      success: true,
      message: 'Package created successfully',
      packageId: insertedPackage.id,
    };
  } catch (error) {
    console.error('Error creating package:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create package',
    };
  }
}

export async function requestDeletion(packageId: number, isArchived: boolean) {
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
  const result = await db
    .update(packages)
    .set({
      isArchived,
    })
    .where(eq(packages.id, packageId));

  if (result.rowCount === 0) {
    return {
      success: false,
      message: 'Package not found',
    };
  }
  revalidatePath('/packages');
  return {
    success: true,
    message: isArchived
      ? 'Package Deleted Successfully'
      : 'Package Deletion Cancelled',
  };
}

export async function updatePackage(
  packageId: number,
  data: z.infer<typeof PackageUpdateSchema>,
) {
  const session = await verifySession();
  if (!session) {
    return { success: false, message: 'Authentication Required.' };
  }
  try {
    const payload = PackageUpdateSchema.parse(data);
    const updateData = {
      status: payload.status,
      label: payload.label,
      deliveryCost: payload.deliveryCost ?? undefined,
    };

    const result = await db
      .update(packages)
      .set(updateData)
      .where(eq(packages.id, packageId))
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        message: 'Package not found or update failed',
      };
    }

    const updatedPackage = result[0];

    revalidatePath('/packages');

    return {
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage,
    };
  } catch (error) {
    console.error('Failed to update package:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update package',
    };
  }
}

export async function updatePackageByBarcode(
  data: z.infer<typeof PackageLogSchema>,
) {
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
  try {
    const payload = PackageLogSchema.parse(data);

    const [updatedPackage] = await db
      .update(packages)
      .set({ status: payload.status, label: payload.label })
      .where(eq(packages.barcode, payload.barcode))
      .returning({
        id: packages.id,
        barcode: packages.barcode,
        status: packages.status,
        label: packages.label,
        createdAt: packages.createdAt,
        updatedAt: packages.updatedAt,
      });

    if (!updatedPackage) {
      return {
        success: false,
        message: 'Package not found or update failed',
      };
    }

    return {
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage,
    };
  } catch (error) {
    console.error('Failed to update package:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update package',
    };
  }
}

export async function deletePackage(packageId: number) {
  try {
    await db.transaction(async (trx) => {
      const pkg = await trx.query.packages.findFirst({
        columns: {
          id: true,
          senderId: true,
          receiverId: true,
          shippingAddressId: true,
          billingAddressId: true,
        },
        where: (pkg, { eq }) => eq(pkg.id, packageId),
      });
      if (!pkg) {
        throw new Error('Package not found');
      }

      // First, delete the package and its items
      await trx.delete(packageItem).where(eq(packageItem.packageId, pkg.id));
      await trx.delete(packages).where(eq(packages.id, pkg.id));

      // Then, delete related data
      await trx.delete(party).where(eq(party.id, pkg.senderId));
      await trx.delete(party).where(eq(party.id, pkg.receiverId));
      await trx.delete(address).where(eq(address.id, pkg.billingAddressId));
      await trx.delete(address).where(eq(address.id, pkg.shippingAddressId));
    });
  } catch (error) {
    console.error('Failed to delete package:', error);
    return { success: false, message: 'Failed to delete package!' };
  }
  revalidatePath('/packages/package-deletion');
  return {
    success: true,
    message: 'Package Deleted Successfully',
  };
}
