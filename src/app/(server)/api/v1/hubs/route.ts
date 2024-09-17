import db from '@/lib/database';
import { address, agents, hubs, users } from '@/lib/database/schema';
import { and, eq, exists, ilike, or, sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export const revalidate = 0;

const SearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(5),
  query: z.string().trim().max(24).optional().default(''),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const { page, pageSize, query } = SearchParamsSchema.parse({
    page: searchParams.get('page'),
    pageSize: searchParams.get('pageSize'),
    query: searchParams.get('query'),
  });

  console.log(page, pageSize, query);

  const whereClause = and(
    exists(db.select().from(agents).where(eq(agents.hubId, hubs.id))),
    query
      ? or(
          ilike(hubs.name, `%${query}%`),
          ilike(address.city, `%${query}%`),
          ilike(address.state, `%${query}%`),
          ilike(address.postalCode, `%${query}%`),
        )
      : undefined,
  );

  const sq = db
    .select({ id: hubs.id })
    .from(hubs)
    .leftJoin(address, eq(hubs.addressId, address.id))
    .where(whereClause)
    .orderBy(hubs.createdAt)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

  const [results, countResult] = await Promise.all([
    db
      .select({
        hubId: hubs.id,
        hubName: hubs.name,
        latitude: hubs.latitude,
        longitude: hubs.longitude,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        agentName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        agentPhone: users.phone,
        agentEmail: users.email,
      })
      .from(hubs)
      .innerJoin(sq, eq(hubs.id, sq.id))
      .leftJoin(address, eq(hubs.addressId, address.id))
      .leftJoin(agents, eq(hubs.id, agents.hubId))
      .leftJoin(users, eq(agents.userId, users.id))
      .orderBy(hubs.createdAt),

    db
      .select({
        count: sql<number>`cast(count(distinct ${hubs.id}) as integer)`,
      })
      .from(hubs)
      .leftJoin(address, eq(hubs.addressId, address.id))
      .where(whereClause),
  ]);

  const totalElements = countResult[0].count;
  const totalPages = Math.ceil(totalElements / pageSize);

  return Response.json({
    data: results,
    page,
    pageSize,
    totalElements,
    totalPages,
  });
}
