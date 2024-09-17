import { and, between, desc, eq, ilike, inArray, or, SQL } from 'drizzle-orm';
import db from '../database';
import { packages } from '../database/schema';
import { verifySession } from '../auth/dal';

import { cargoItem } from '../database/schema';
import { parseISO } from 'date-fns';

export async function getCargoList(
  query: string = '',
  page: number = 1,
  limit: number = 10,
) {
  const searchCondition = query
    ? or(ilike(cargoItem.name, `%${query}%`))
    : undefined;

  return await db.query.cargoItem.findMany({
    columns: { isActive: false, createdAt: false, updatedAt: false },
    where: and(eq(cargoItem.isActive, true), searchCondition),
    limit,
    offset: (page - 1) * limit,
    orderBy: desc(cargoItem.createdAt),
  });
}

export async function getCargoItem(id: number) {
  return await db.query.cargoItem.findFirst({
    where: eq(cargoItem.id, id),
  });
}

export async function getAllPackages({
  page = 1,
  limit = 10,
  query,
  status,
  label,
  startDate,
  endDate,
  isArchived = false,
}: any) {
  const session = await verifySession();

  let whereClause = [];

  if (session.role === 'AGENT') {
    const agent = await db.query.agents.findFirst({
      columns: { id: true },
      where: (agent, { eq }) => eq(agent.userId, Number(session.userId)),
    });
    agent && whereClause.push(eq(packages.agentId, agent.id));
  }

  if (query) {
    const searchConditions: SQL<unknown>[] = [
      ilike(packages.barcode, `%${query}%`),
      ilike(packages.clientTaxCode, `%${query}%`),
    ];
    whereClause.push(or(...searchConditions));
  }

  if (status && Array.isArray(status)) {
    whereClause.push(inArray(packages.status, status));
  }

  if (status && !Array.isArray(status)) {
    whereClause.push(eq(packages.status, status));
  }

  if (label) {
    console.log('label block');
    whereClause.push(eq(packages.label, label));
  }

  // if (startDate && endDate) {
  //   console.log('range block');
  //   whereClause.push(between(packages.createdAt, startDate, endDate));
  // }

  if (startDate && endDate) {
    console.log('range block');
    const parsedStartDate = parseISO(startDate);
    const parsedEndDate = parseISO(endDate);
    whereClause.push(
      between(packages.createdAt, parsedStartDate, parsedEndDate),
    );
  }

  if (!isArchived) {
    console.log('isArchived block');
    whereClause.push(eq(packages.isArchived, isArchived));
  }

  const data = await db.query.packages.findMany({
    columns: {
      id: true,
      barcode: true,
      status: true,
      label: true,
      totalAmount: true,
      deliveryCost: session.role === 'ADMIN' ? true : false,
      createdAt: true,
    },
    with: {
      sender: true,
      receiver: true,
      // billingAddress: true,
      // shippingAddress: true,
      lineItems: true,
    },
    where: whereClause.length > 0 ? and(...whereClause) : undefined,
    extras: (packages, { sql }) => ({
      totalCount: sql<number>`count(*) over()`.as('total_count'),
    }),
    orderBy: desc(packages.createdAt),
    limit,
    offset: (page - 1) * limit,
  });

  const totalCount = data[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    page: Number(page),
    limit,
    totalCount,
    totalPages,
  };
}

export async function getPackage(barcode: string) {
  return await db.query.packages.findFirst({
    columns: {
      id: true,
      barcode: true,
      status: true,
      label: true,
      discountAmount: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,
    },
    where: (packages, { eq }) => eq(packages.barcode, barcode),
    with: {
      sender: true,
      receiver: true,
      agent: {
        columns: {},
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      billingAddress: true,
      shippingAddress: true,
      sourceHub: true,
      destinationHub: true,
      deliveryZone: true,
      deliveryOption: true,
      lineItems: {
        with: {
          cargoItem: true,
        },
      },
    },
  });
}
