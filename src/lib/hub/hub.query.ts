import db from '@/lib/database';
import { address, agents, hubs, users } from '../database/schema';
import { and, count, eq, ilike, like, or, sql } from 'drizzle-orm';
import { PgSelect } from 'drizzle-orm/pg-core';

export async function getHubs(query: string = '', limit: number = 5) {
  return await db.query.hubs.findMany({
    columns: {
      id: true,
      name: true,
    },
    where: (hubs, { and, eq, or, ilike }) =>
      and(
        eq(hubs.isActive, true),
        query ? or(ilike(hubs.name, `%${query}%`)) : undefined,
      ),
    limit,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
}

// export async function getHubList(
//   query: string = '',
//   page: number = 1,
//   limit: number = 10,
// ) {
//   const data = await db.query.hubs.findMany({
//     with: {
//       address: true,
//     },
//     where: (hubs, { and, or, ilike }) =>
//       and(query ? or(ilike(hubs.name, `%${query}%`)) : undefined),
//     extras: (hubs, { sql }) => ({
//       totalCount: sql<number>`count(*) over()`.as('total_count'),
//     }),
//     limit,
//     offset: (page - 1) * limit,
//     orderBy: (hubs, { desc }) => [desc(hubs.createdAt)],
//   });

//   const totalCount = data[0]?.totalCount || 0;
//   const totalPages = Math.ceil(totalCount / limit);

//   return {
//     data,
//     page,
//     limit,
//     totalCount,
//     totalPages,
//   };
// }

function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number = 10,
) {
  return qb.limit(pageSize).offset(page * pageSize);
}

export const getHubList = async (
  query: string = '',
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const baseQuery = db
    .select()
    .from(hubs)
    .leftJoin(address, eq(hubs.addressId, address.id))
    .where(
      or(
        ilike(hubs.name, `%${query}%`),
        ilike(address.city, `%${query}%`),
        ilike(address.state, `%${query}%`),
        ilike(address.postalCode, `%${query}%`),
      ),
    );

  const [results, countResult] = await Promise.all([
    baseQuery.limit(pageSize).offset(offset),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(baseQuery.as('subquery')),
  ]);

  const totalCount = countResult[0].count;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: results,
    page,
    pageSize,
    totalCount,
    totalPages,
  };
};

// export const getHubListWithAgents = async (
//   query: string = '',
//   page: number = 1,
//   pageSize: number = 10,
// ) => {
//   const offset = (page - 1) * pageSize;

//   const baseQuery = db
//     .select({
//       hub: {
//         id: hubs.id,
//         name: hubs.name,
//         latitude: hubs.latitude,
//         longitude: hubs.longitude,
//       },
//       address: {
//         addressLine1: address.addressLine1,
//         addressLine2: address.addressLine2,
//         city: address.city,
//         state: address.state,
//         postalCode: address.postalCode,
//         country: address.country,
//       },
//       agents: {
//         id: agents.id,
//       },
//     })
//     .from(hubs)
//     .leftJoin(address, eq(hubs.addressId, address.id))
//     .leftJoin(agents, eq(hubs.id, agents.hubId))
//     .where(
//       or(
//         ilike(hubs.name, `%${query}%`),
//         ilike(address.city, `%${query}%`),
//         ilike(address.state, `%${query}%`),
//         ilike(address.postalCode, `%${query}%`),
//       ),
//     )
//     .groupBy(hubs.id, agents.hubId);

//   const [results, countResult] = await Promise.all([
//     baseQuery.limit(pageSize).offset(offset),
//     db
//       .select({ count: sql<number>`cast(count(*) as int)` })
//       .from(baseQuery.as('subquery')),
//   ]);

//   const totalCount = countResult[0].count;
//   const totalPages = Math.ceil(totalCount / pageSize);

//   return {
//     data: results,
//     page,
//     pageSize,
//     totalCount,
//     totalPages,
//   };
// };

// export const getHubListWithAgents = async (
//   query: string = '',
//   page: number = 1,
//   pageSize: number = 3,
// ) => {
//   const baseQuery = db
//     .select({
//       hubName: hubs.name,
//       latitude: hubs.latitude,
//       longitude: hubs.longitude,
//       addressLine1: address.addressLine1,
//       addressLine2: address.addressLine2,
//       city: address.city,
//       state: address.state,
//       postalCode: address.postalCode,
//       agentName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
//       agentPhone: users.phone,
//       agentEmail: users.email,
//     })
//     .from(hubs)
//     .leftJoin(address, eq(hubs.addressId, address.id))
//     .leftJoin(agents, eq(hubs.id, agents.hubId))
//     .leftJoin(users, eq(agents.userId, users.id))
//     .where(
//       or(
//         ilike(hubs.name, `%${query}%`),
//         ilike(address.city, `%${query}%`),
//         ilike(address.state, `%${query}%`),
//         ilike(address.postalCode, `%${query}%`),
//       ),
//     )
//     .limit(pageSize)
//     .orderBy(hubs.createdAt)
//     .offset((page - 1) * pageSize);

//   const [data, count] = await Promise.all([
//     baseQuery,
//     db
//       .select({ count: sql<number>`cast(count(*) as int)` })
//       .from(baseQuery.as('subquery')),
//   ]);

//   const totalCount = count[0].count;
//   const totalPages = Math.ceil(totalCount / pageSize);

//   return {
//     data,
//     page,
//     pageSize,
//     totalCount,
//     totalPages,
//   };
// };

export const getHubListWithAgents = async (
  query: string = '',
  page: number = 1,
  pageSize: number = 5,
) => {
  const whereClause = or(
    ilike(hubs.name, `%${query}%`),
    ilike(address.city, `%${query}%`),
    ilike(address.state, `%${query}%`),
    ilike(address.postalCode, `%${query}%`),
  );

  const data = await db
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
    .leftJoin(address, eq(hubs.addressId, address.id))
    .leftJoin(agents, eq(hubs.id, agents.hubId))
    .leftJoin(users, eq(agents.userId, users.id))
    .where(whereClause)
    .orderBy(hubs.createdAt)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    data,
    page,
    pageSize,
  };
};
