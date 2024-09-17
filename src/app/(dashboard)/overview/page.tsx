import DataCard from '@/components/overview/data-card';
import RevenueOverview from '@/components/overview/revenue-overview';
import { DollarSign } from 'lucide-react';
import { verifySession } from '@/lib/auth/dal';

import RecentPackages from '@/components/overview/recent-packages';
import { unstable_cache as NextCache } from 'next/cache';
import {
  getWeeklyRevenue,
  getMonthlyRevenue,
  getWeeklyNetProfit,
  getMonthlyNetProfit,
  getTotalPackagesCreatedThisMonth,
  getNetProfilt,
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

  const weeklyNetProfit = NextCache(getWeeklyNetProfit, ['weekly-net-profit'], {
    tags: ['weekly-net-profit'],
    revalidate: 30,
  });

  const monthlyNetProfit = NextCache(
    getMonthlyNetProfit,
    ['monthly-net-profit'],
    {
      tags: ['monthly-net-profit'],
      revalidate: 30,
    },
  );

  const totalPackagesMonth = NextCache(
    getTotalPackagesCreatedThisMonth,
    ['total-packages'],
    {
      tags: ['total-packages'],
      revalidate: 30,
    },
  );

  // const rev = await weeklyRevenue(
  //   Number(session.userId),
  //   session.role as string,
  // );

  const [
    weeklyRev,
    monthlyRev,
    weeklyNetProf,
    monthlyNetProf,
    totalPackages,
    netProfit,
  ] = await Promise.all([
    weeklyRevenue(Number(session.userId), session.role as string),
    monthlyRevenue(Number(session.userId), session.role as string),
    weeklyNetProfit(Number(session.userId), session.role as string),
    monthlyNetProfit(Number(session.userId), session.role as string),
    totalPackagesMonth(Number(session.userId), session.role as string),
    getNetProfilt(Number(session.userId), session.role as string),
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
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </DataCard>

        <DataCard
          data={{
            title: 'Total Net Profit',
            period: 'month',
            current: Number(netProfit?.totalProfit),
            last: Number(monthlyNetProf?.lastMonthNetProfit),
          }}
        >
          <DollarSign className="h-4 w-4 text-muted-foreground" />
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
            title: 'Weekly Net Profit',
            period: 'week',
            current: Number(weeklyNetProf?.thisWeekNetProfit),
            last: Number(weeklyNetProf?.lastWeekNetProfit),
          }}
        >
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </DataCard>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7">
        <RevenueOverview />
        <RecentPackages />
      </section>
    </div>
  );
}
