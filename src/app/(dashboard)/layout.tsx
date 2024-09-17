import DashboardPannelLayout from '@/components/layout/dashboard-layout';
import { Navbar } from '@/components/shared/navbar';
import { getUser } from '@/lib/auth/dal';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <>
      <DashboardPannelLayout role={user?.role}>
        <Navbar user={user} />
        {children}
      </DashboardPannelLayout>
    </>
  );
}
