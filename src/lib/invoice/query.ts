'use server';

import { count, desc, inArray, like, SQL, sql } from 'drizzle-orm';
import db from '../database';
import { clients, packages } from '../database/schema';
import { and, between, eq, ilike, or } from 'drizzle-orm';

interface GetPackagesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'in progress' | 'dispatched' | 'on air' | 'deliverd';
  label?: 'Received At Hub' | 'Delivered';
  startDate?: Date;
  endDate?: Date;
  isArchived?: boolean;
}

export async function getPackages({
  page = 1,
  pageSize = 10,
  search,
  status,
  label,
  startDate,
  endDate,
  isArchived = false,
}: GetPackagesParams) {
  const offset = (page - 1) * pageSize;

  let whereClause = [];

  if (search) {
    console.log('search', search);
    const searchConditions: SQL<unknown>[] = [
      //   eq(packages.id, Number(search)),
      ilike(packages.barcode, `%${search}%`),
      ilike(packages.clientTaxCode, `%${search}%`),
    ];
    whereClause.push(or(...searchConditions));
  }

  if (status) {
    console.log('status block');
    whereClause.push(eq(packages.status, status));
  }

  if (label) {
    console.log('label block');
    whereClause.push(eq(packages.label, label));
  }

  if (startDate && endDate) {
    console.log('range block');
    whereClause.push(between(packages.createdAt, startDate, endDate));
  }

  if (!isArchived) {
    console.log('isArchived block');
    whereClause.push(eq(packages.isArchived, isArchived));
  }

  //   if (!isAdmin) {
  //     whereClause.push(eq(packages.listedBy, userId));
  //   }

  //   // Get total count
  //   const totalCountResult = await db
  //     .select({ count: sql`count(*)` })
  //     .from(packages)
  //     .where(whereClause.length > 0 ? and(...whereClause) : undefined);

  //   const totalCount = Number(totalCountResult[0].count);

  console.log(whereClause.length ? 'filter on' : 'no filter');

  const [data, total] = await Promise.all([
    db.query.packages.findMany({
      // with: { invoice: true },
      where: whereClause.length > 0 ? and(...whereClause) : undefined,
      orderBy: desc(packages.createdAt),
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),

    db
      .select({
        count: count(),
      })
      .from(packages)
      .where(whereClause.length > 0 ? and(...whereClause) : undefined)
      .execute()
      .then((res) => res[0]?.count ?? 0),
  ]);

  return {
    data,
    page,
    pageSize,
    totalPages: Math.ceil(Number(total) / pageSize),
  };
}

interface GetSearchablePackagesParams {
  search?: string;
  agentId?: number;
  clientId?: number;
  status?: ['in progress', 'dispatched', 'on air', 'deliverd'];
  label?: ['Received At Hub', 'Delivered'];
  sourceHubId?: number;
  destinationHubId?: number;
  page?: number;
  pageSize?: number;
}

export async function getSearchablePackages(
  params: GetSearchablePackagesParams,
) {
  const {
    search,
    agentId,
    clientId,
    status,
    label,
    sourceHubId,
    destinationHubId,
    page = 1,
    pageSize = 20,
  } = params;

  let whereClause = [];

  let query = db
    .select()
    .from(packages)
    .leftJoin(clients, eq(packages.clientId, clients.id))
    .prepare('package_query');
  // .leftJoin(hubs.as('sourceHub'), eq(packages.sourceHubId, sourceHub.id))
  // .leftJoin(hubs.as('destHub'), eq(packages.destinationHubId, destHub.id));

  // Search condition
  if (search) {
    const searchConditions = [
      eq(packages.barcode, `%${search}%`),
      eq(packages.id, parseInt(search, 10) || 0),
      eq(clients.taxCode, `%${search}%`),
    ];
    whereClause.push(or(...searchConditions));
  }

  // Filter conditions
  if (agentId) {
    whereClause.push(eq(packages.agentId, agentId));
  }
  if (clientId) {
    whereClause.push(eq(packages.clientId, clientId));
  }
  if (status && status.length > 0) {
    whereClause.push(inArray(packages.status, status));
  }
  if (label && label.length > 0) {
    whereClause.push(inArray(packages.label, label));
  }
  if (sourceHubId) {
    whereClause.push(eq(packages.sourceHubId, sourceHubId));
  }
  if (destinationHubId) {
    whereClause.push(eq(packages.destinationHubId, destinationHubId));
  }

  //   if (startDate && endDate) {
  //     whereClause.push(between(packages.createdAt, startDate, endDate));
  //   }

  // Calculate total count
  //   const totalCountQuery = query
  //     .clone()
  //     .select({ count: sql`count(*)`.as('count') });
  //   const [{ count }] = await totalCountQuery;

  // Apply pagination
  const offset = (page - 1) * pageSize;
  //   query = query.limit(pageSize).offset(offset);

  // Execute query
  const results = await query.execute();

  return {
    search,
    packages: results,
    // totalCount: Number(count),
    page,
    pageSize,
    // totalPages: Math.ceil(Number(count) / pageSize),
  };
}
