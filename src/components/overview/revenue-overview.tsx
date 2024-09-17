import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from '@/components/ui/bar-chart';
import { verifySession } from '@/lib/auth/dal';

import db from '@/lib/database';
import { agents, packages } from '@/lib/database/schema';
import { and, sql } from 'drizzle-orm';
import { PgSelect } from 'drizzle-orm/pg-core';
import { unstable_cache as NextCache } from 'next/cache';

async function getLastSixMonthsRevenue(userId: number, role: string) {
  function withRoles<T extends PgSelect>(qb: T, role: string, userId: number) {
    if (role !== 'ADMIN') {
      return qb
        .leftJoin(agents, sql`${agents.id} = ${packages.agentId}`)
        .where(
          and(
            sql`${packages.createdAt} >= date_trunc('month', current_date - interval '5 months')`,
            sql`${agents.userId} = ${userId}`,
          ),
        );
    }
    return qb.where(
      sql`${packages.createdAt} >= date_trunc('month', current_date - interval '5 months')`,
    );
  }

  const query = db
    .select({
      name: sql<string>`to_char(date_trunc('month', ${packages.createdAt}), 'Mon')`.as(
        'month',
      ),
      total: sql<number>`COALESCE(sum(${packages.totalAmount}), 0)`.as('total'),
    })
    .from(packages)
    .$dynamic();

  return await withRoles(query, role as string, Number(userId))
    .groupBy(sql`date_trunc('month', ${packages.createdAt})`)
    .orderBy(sql`date_trunc('month', ${packages.createdAt})`);
}

export default async function RevenueOverview() {
  const session = await verifySession();

  if (!session || !session.isAuth) return;

  const revOverview = NextCache(
    getLastSixMonthsRevenue,
    ['lastSixMonthsRevenue', session.userId as string, session.role as string],
    {
      tags: [
        'lastSixMonthsRevenue',
        session.userId as string,
        session.role as string,
      ],
      revalidate: 600,
    },
  );

  const lastSixMonthsData = await revOverview(
    Number(session.userId),
    session.role as string,
  );

  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const lastSixMonths = monthOrder
    .slice(currentMonth - 5, currentMonth + 1)
    .map((month) => ({ name: month, total: 0 }));

  lastSixMonthsData.forEach((row) => {
    const index = lastSixMonths.findIndex((item) => item.name === row.name);
    if (index !== -1) {
      lastSixMonths[index].total = Number(row.total);
    }
  });

  return (
    <Card className="md:col-span-8 lg:col-span-3 xl:col-span-3">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart data={lastSixMonths} />
      </CardContent>
    </Card>
  );
}
