import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { verifySession } from '@/lib/auth/dal';
import { SessionPayload } from '@/lib/auth/definitions';
import db from '@/lib/database';
import { sql } from 'drizzle-orm';
import { unstable_cache as NextCache } from 'next/cache';

const preparedQueryWithAgent = db.query.packages
  .findMany({
    with: {
      client: {
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    where: (pkg, { eq }) => eq(pkg.agentId, sql.placeholder('agentId')),
    limit: 5,
    orderBy: (pkg, { desc }) => [desc(pkg.id)],
  })
  .prepare('recent-packages-with-agent');

const preparedQueryWithoutAgent = db.query.packages
  .findMany({
    with: {
      client: {
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    limit: 5,
    orderBy: (pkg, { desc }) => [desc(pkg.id)],
  })
  .prepare('recent-packages-without-agent');

async function recentPackages(
  session: {
    isAuth: boolean;
    userId: string | unknown;
    role: string | unknown;
  } | null,
) {
  if (!session) {
    return [];
  }

  try {
    if (session.role === 'AGENT') {
      const agent = await db.query.agents.findFirst({
        where: (agent, { eq }) => eq(agent.userId, Number(session.userId)),
        columns: { id: true },
      });

      if (!agent) {
        return [];
      }

      return await preparedQueryWithAgent.execute({ agentId: agent.id });
    } else {
      return await preparedQueryWithoutAgent.execute();
    }
  } catch (error) {
    console.log('failed to fetch recent invoice', error);
    return [];
  }
}

export default async function RecentPackages() {
  const session = await verifySession();
  const cachedRecentPackages = NextCache(recentPackages, ['recent-packages'], {
    tags: ['recent-packages', String(session?.userId)],
    revalidate: 300,
  });
  const packages = await cachedRecentPackages(session!!);
  return (
    <Card className="md:col-span-4 lg:col-span-4">
      <CardHeader>
        <CardTitle>Recent Packages</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {packages.length > 0 ? (
          <>
            {packages.map((pkg) => (
              <div key={pkg.barcode} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage
                    src={
                      pkg.client.user.imageUrl ? pkg.client.user.imageUrl : '#'
                    }
                    alt={`${pkg.client.user.lastName}'s Image`}
                  />
                  <AvatarFallback>
                    {pkg.client.user.firstName[0]}
                    {pkg.client.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{`${pkg.client.user.firstName} ${pkg.client.user.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">
                    {pkg.client.user.email}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +€{parseFloat(pkg.totalAmount).toFixed(2)}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center">
            <h1 className="text-muted-foreground">No Recent Packages</h1>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
