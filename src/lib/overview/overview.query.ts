import { eq, sql } from 'drizzle-orm';
import db from '../database';
import { agents, packages } from '../database/schema';

export async function getWeeklyRevenue(userId: number, role: string) {
  let query = db
    .select({
      thisWeekRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${packages.createdAt} >= date_trunc('week', CURRENT_DATE) THEN ${packages.totalAmount} ELSE 0 END), 0)`,
      lastWeekRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${packages.createdAt} >= date_trunc('week', CURRENT_DATE - INTERVAL '1 week') AND ${packages.createdAt} < date_trunc('week', CURRENT_DATE) THEN ${packages.totalAmount} ELSE 0 END), 0)`,
    })
    .from(packages)
    .$dynamic();

  if (role === 'AGENT') {
    query = query
      .innerJoin(agents, eq(packages.agentId, agents.id))
      .where(eq(agents.userId, userId));
  }

  const result = await query;
  return result[0];
}

export async function getMonthlyRevenue(userId: number, role: string) {
  let query = db
    .select({
      thisMonthRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE) THEN ${packages.totalAmount} ELSE 0 END), 0)`,
      lastMonthRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND ${packages.createdAt} < date_trunc('month', CURRENT_DATE) THEN ${packages.totalAmount} ELSE 0 END), 0)`,
    })
    .from(packages)
    .$dynamic();

  if (role === 'AGENT') {
    query = query
      .innerJoin(agents, eq(packages.agentId, agents.id))
      .where(eq(agents.userId, userId));
  }

  const result = await query;
  return result[0];
}

export async function getNetProfit(userId: number, role: string) {
  let query = db
    .select({
      thisMonth: sql<number>`
        sum(
          CASE
            WHEN DATE_TRUNC('month', ${packages.createdAt}) = DATE_TRUNC('month', CURRENT_DATE)
            THEN (${packages.totalAmount} - ${packages.deliveryCost})
            ELSE 0
          END
        )`,
      lastMonth: sql<number>`
        sum(
          CASE
            WHEN DATE_TRUNC('month', ${packages.createdAt}) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            THEN (${packages.totalAmount} - ${packages.deliveryCost})
            ELSE 0
          END
        )`,
    })
    .from(packages)
    .$dynamic();

  if (role === 'AGENT') {
    query = query
      .innerJoin(agents, eq(packages.agentId, agents.id))
      .where(eq(agents.userId, userId));
  }

  const result = await query;
  return result[0];
}

export async function getPackageCount(userId: number, role: string) {
  let query = db
    .select({
      thisMonth: sql<number>`
        COUNT(CASE 
          WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE)
          THEN 1 
          ELSE 0 
        END)`,
      lastMonth: sql<number>`
        COUNT(CASE 
          WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
            AND ${packages.createdAt} < date_trunc('month', CURRENT_DATE)
          THEN 1 
          ELSE 0 
        END)`,
    })
    .from(packages)
    .$dynamic();

  if (role === 'AGENT') {
    query = query
      .innerJoin(agents, eq(packages.agentId, agents.id))
      .where(eq(agents.userId, userId));
  }

  const result = await query;
  return {
    thisMonth: result[0].thisMonth,
    lastMonth: result[0].lastMonth,
  };
}
