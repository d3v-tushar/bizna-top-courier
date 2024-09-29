import DataCard from '@/components/overview/data-card';
import RevenueOverview from '@/components/overview/revenue-overview';
import { Banknote, DollarSign, Euro, Package } from 'lucide-react';
import { verifySession } from '@/lib/auth/dal';

import RecentPackages from '@/components/overview/recent-packages';
import { unstable_cache as NextCache } from 'next/cache';
import {
  getWeeklyRevenue,
  getMonthlyRevenue,
  getPackageCount,
  getNetProfit,
} from '@/lib/overview/overview.query';

export const revalidate = 60; // 1 minutes

export default async function DashboardPage() {
  const session = await verifySession();
  const weeklyRevenue = NextCache(getWeeklyRevenue, ['weekly-revenue'], {
    tags: ['weekly-revenue'],
    revalidate: 30,
  });
  const monthlyRevenue = NextCache(getMonthlyRevenue, ['monthly-revenue'], {
    tags: ['monthly-revenue'],
    revalidate: 30,
  });

  const getTotalPackageCount = NextCache(getPackageCount, ['total-packages'], {
    tags: ['total-packages'],
    revalidate: 30,
  });

  const [weeklyRev, monthlyRev, totalPackages, netProfit] = await Promise.all([
    weeklyRevenue(Number(session.userId), session.role as string),
    monthlyRevenue(Number(session.userId), session.role as string),
    getTotalPackageCount(Number(session.userId), session.role as string),
    getNetProfit(Number(session.userId), session.role as string),
  ]);

  return (
    <div className="mt-4 space-y-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          data={{
            title: 'Total Revenue',
            period: 'month',
            current: Number(monthlyRev?.thisMonthRevenue),
            last: Number(monthlyRev?.lastMonthRevenue),
          }}
        >
          <Euro className="h-4 w-4 text-muted-foreground" />
        </DataCard>

        <DataCard
          data={{
            title: 'Net Profit',
            period: 'month',
            current: Number(netProfit?.thisMonth),
            last: Number(netProfit?.lastMonth),
          }}
        >
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </DataCard>

        <DataCard
          data={{
            title: 'Weekly Revenue',
            period: 'week',
            current: Number(weeklyRev?.thisWeekRevenue),
            last: Number(weeklyRev?.thisWeekRevenue),
          }}
        >
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </DataCard>

        <DataCard
          data={{
            title: 'Packages Created',
            period: 'month',
            current: Number(totalPackages?.thisMonth),
            last: Number(totalPackages?.lastMonth),
          }}
        >
          <Package className="h-4 w-4 text-muted-foreground" />
        </DataCard>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7">
        <RevenueOverview />
        <RecentPackages />
      </section>
    </div>
  );
}
