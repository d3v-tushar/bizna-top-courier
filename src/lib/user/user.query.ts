import db from '@/lib/database';
import { getSession } from '../auth/session';
import { redirect } from 'next/navigation';
import { agents, clients, users } from '@/lib/database/schema';
import { and, desc, eq, ilike, like, or, sql } from 'drizzle-orm';

export async function getUserMe() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return await db.query.users.findFirst({
    columns: {
      isActive: false,
      createdAt: false,
      updatedAt: false,
    },
    where: (users, { eq }) => eq(users.id, Number(session.userId)),
  });
}

export async function getClientUsers(query: string = '', limit: number = 2) {
  return await db.query.users.findMany({
    columns: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
    where: (users, { and, eq, or, ilike }) =>
      and(
        eq(users.role, 'CLIENT'),
        query
          ? or(
              ilike(users.firstName, `%${query}%`),
              ilike(users.lastName, `%${query}%`),
              ilike(users.email, `%${query}%`),
              ilike(users.phone, `%${query}%`),
            )
          : undefined,
      ),
    with: {
      client: {
        columns: {
          id: true,
          taxCode: true,
        },
      },
    },
    limit: limit,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
}

export async function findClient(query: string = '', limit: number = 5) {
  return await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      clientId: clients.id,
      taxCode: clients.taxCode,
    })
    .from(users)
    .innerJoin(clients, eq(users.id, clients.userId))
    .where(
      and(
        eq(users.role, 'CLIENT'),
        or(
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
          ilike(users.phone, `%${query}%`),
          ilike(users.email, `%${query}%`),
          eq(clients.taxCode, query),
        ),
      ),
    )
    .limit(limit);
}

export async function getClientByTaxCode(taxCode: string = '') {
  return await db.query.clients.findFirst({
    columns: {
      id: true,
      taxCode: true,
    },
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
    where: (clients, { eq }) => eq(clients.taxCode, taxCode),
  });
}

export async function getAdminList(
  query: string = '',
  page: number = 1,
  pageSize: number = 10,
) {
  const data = await db.query.users.findMany({
    where: (users, { and, eq, or, ilike }) =>
      and(
        eq(users.role, 'ADMIN'),
        query
          ? or(
              ilike(users.firstName, `%${query}%`),
              ilike(users.lastName, `%${query}%`),
              ilike(users.email, `%${query}%`),
              ilike(users.phone, `%${query}%`),
            )
          : undefined,
      ),
    extras: (users, { sql }) => ({
      totalElements: sql<number>`count(*) over()`.as('total_count'),
    }),
    with: {
      admin: true,
    },
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  const totalElements = data[0]?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / pageSize);

  return {
    data,
    page,
    pageSize,
    totalElements,
    totalPages,
  };
}

export async function getAgentList(
  query: string = '',
  page: number = 1,
  pageSize: number = 10,
) {
  const whereClause = and(
    eq(users.role, 'AGENT'),
    query
      ? or(
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
          ilike(users.email, `%${query}%`),
          ilike(users.phone, `%${query}%`),
          ilike(agents.taxCode, `%${query}%`),
          ilike(agents.vatNumber, `%${query}%`),
          ilike(agents.passportNumber, `%${query}%`),
          ilike(agents.iban, `%${query}%`),
        )
      : undefined,
  );

  const baseQuery = db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      imageUrl: users.imageUrl,
      email: users.email,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      totalElements: sql<number>`count(*) over()`.as('total_count'),
    })
    .from(users)
    .leftJoin(agents, eq(users.id, agents.userId))
    .where(whereClause)
    .orderBy(desc(users.createdAt));

  const data = await baseQuery.limit(pageSize).offset((page - 1) * pageSize);
  const totalElements = data[0]?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / pageSize);

  return {
    data,
    page,
    pageSize,
    totalElements,
    totalPages,
  };
}

export async function getClientList(
  query: string = '',
  page: number = 1,
  pageSize: number = 10,
) {
  const whereClause = and(
    eq(users.role, 'CLIENT'),
    query
      ? or(
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
          ilike(users.email, `%${query}%`),
          ilike(users.phone, `%${query}%`),
          ilike(clients.taxCode, `%${query}%`),
        )
      : undefined,
  );

  const baseQuery = db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      imageUrl: users.imageUrl,
      email: users.email,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      totalElements: sql<number>`count(*) over()`.as('total_count'),
    })
    .from(users)
    .leftJoin(clients, eq(users.id, clients.userId))
    .where(whereClause)
    .orderBy(desc(users.createdAt));

  const data = await baseQuery.limit(pageSize).offset((page - 1) * pageSize);
  const totalElements = data[0]?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / pageSize);

  return {
    data,
    page,
    pageSize,
    totalElements,
    totalPages,
  };
}

// export async function getClientList(
//   query: string = '',
//   page: number = 1,
//   limit: number = 10,
// ) {
//   const data = await db.query.users.findMany({
//     where: (users, { and, eq, or, ilike }) =>
//       and(
//         eq(users.role, 'CLIENT'),
//         query
//           ? or(
//               ilike(users.firstName, `%${query}%`),
//               ilike(users.lastName, `%${query}%`),
//               ilike(users.email, `%${query}%`),
//               ilike(users.phone, `%${query}%`),
//             )
//           : undefined,
//       ),
//     extras: (users, { sql }) => ({
//       totalCount: sql<number>`count(*) over()`.as('total_count'),
//     }),
//     with: {
//       client: true,
//     },
//     limit,
//     offset: (page - 1) * limit,
//     orderBy: (users, { desc }) => [desc(users.createdAt)],
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
