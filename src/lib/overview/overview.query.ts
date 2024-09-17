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

export async function getWeeklyNetProfit(userId: number, role: string) {
  let query = db
    .select({
      thisWeekNetProfit: sql<number>`
        COALESCE(SUM(
          CASE WHEN ${packages.createdAt} >= date_trunc('week', CURRENT_DATE)
          AND ${packages.status} = 'delivered'
          AND ${packages.deliveryCost} IS NOT NULL
          THEN ${packages.totalAmount} - ${packages.deliveryCost}
          ELSE 0 END
        ), 0)
      `,
      lastWeekNetProfit: sql<number>`
        COALESCE(SUM(
          CASE WHEN ${packages.createdAt} >= date_trunc('week', CURRENT_DATE - INTERVAL '1 week')
          AND ${packages.createdAt} < date_trunc('week', CURRENT_DATE)
          THEN ${packages.totalAmount} - ${packages.deliveryCost}
          ELSE 0 END
        ), 0)
      `,
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

export async function getMonthlyNetProfit(userId: number, role: string) {
  let query = db
    .select({
      thisMonthNetProfit: sql<number>`
        COALESCE(SUM(
          CASE WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE)
          AND ${packages.status} = 'delivered'
          AND ${packages.deliveryCost} IS NOT NULL
          THEN ${packages.totalAmount} - ${packages.deliveryCost}
          ELSE 0 END
        ), 0)
      `,
      lastMonthNetProfit: sql<number>`
        COALESCE(SUM(
          CASE WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
          AND ${packages.createdAt} < date_trunc('month', CURRENT_DATE)
          AND ${packages.status} = 'delivered'
          AND ${packages.deliveryCost} IS NOT NULL
          THEN ${packages.totalAmount} - ${packages.deliveryCost}
          ELSE 0 END
        ), 0)
      `,
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

export async function getTotalPackagesCreatedThisMonth(
  userId: number,
  role: string,
) {
  let query = db
    .select({
      totalPackages: sql<number>`
        COUNT(CASE WHEN ${packages.createdAt} >= date_trunc('month', CURRENT_DATE)
        THEN 1 ELSE NULL END)
      `,
    })
    .from(packages)
    .$dynamic();

  if (role === 'AGENT') {
    query = query
      .innerJoin(agents, eq(packages.agentId, agents.id))
      .where(eq(agents.userId, userId));
  }

  const result = await query;
  return result[0].totalPackages;
}

export async function getNetProfilt(userId: number, role: string) {
  let query = db
    .select({
      totalProfit: sql<number>`sum(${packages.totalAmount} - ${packages.deliveryCost})`,
    })
    .from(packages)
    .where(
      sql`DATE_TRUNC('month', ${packages.createdAt}) = DATE_TRUNC('month', CURRENT_DATE)`,
    )
    .$dynamic();

  if (role === 'AGENT') {
    query = query
      .innerJoin(agents, eq(packages.agentId, agents.id))
      .where(eq(agents.userId, userId));
  }

  const result = await query;
  return result[0];
}
