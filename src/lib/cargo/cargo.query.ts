import db from '@/lib/database';

export async function getCargoItems(query: string = '', limit: number = 20) {
  return await db.query.cargoItem.findMany({
    columns: { isActive: false, createdAt: false, updatedAt: false },
    where: (cargoItem, { and, eq, or, ilike }) =>
      and(
        eq(cargoItem.isActive, true),
        query ? or(ilike(cargoItem.name, `%${query}%`)) : undefined,
      ),
    limit,
    orderBy: (cargoItem, { desc }) => [desc(cargoItem.createdAt)],
  });
}

export async function getCargoItemList(
  query: string = '',
  page: number = 1,
  limit: number = 10,
) {
  const data = await db.query.cargoItem.findMany({
    where: (cargoItem, { and, eq, or, ilike }) =>
      and(query ? or(ilike(cargoItem.name, `%${query}%`)) : undefined),
    extras: (cargoItem, { sql }) => ({
      totalCount: sql<number>`count(*) over()`.as('total_count'),
    }),
    limit,
    offset: (page - 1) * limit,
    orderBy: (cargoItem, { desc }) => [desc(cargoItem.createdAt)],
  });

  const totalCount = data[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    page,
    limit,
    totalCount,
    totalPages,
  };
}
