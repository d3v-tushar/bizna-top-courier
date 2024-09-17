import db from '@/lib/database';

export async function getZoneWithOptions(
  query: string = '',
  limit: number = 20,
) {
  return await db.query.deliveryZone.findMany({
    columns: {
      id: true,
      name: true,
    },
    with: {
      deliveryOption: {
        columns: {
          id: true,
          name: true,
        },
        where: (deliveryOption, { eq }) => eq(deliveryOption.isActive, true),
      },
    },
    where: (deliveryZone, { and, eq, or, ilike }) =>
      and(
        eq(deliveryZone.isActive, true),
        query ? or(ilike(deliveryZone.name, `%${query}%`)) : undefined,
      ),
    limit: limit,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
}
