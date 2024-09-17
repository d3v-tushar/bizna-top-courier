'use client';

import { cn } from '@/lib/utils';
import { useStore } from '@/hooks/use-store';
import { DashboardFooter } from '@/components/shared/dashboard-footer';
import { Sidebar } from '@/components/shared/sidebar';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

export default function DashboardPannelLayout({
  role,
  children,
}: {
  role: 'ADMIN' | 'AGENT' | 'CLIENT' | undefined;
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar role={role} />
      <main
        className={cn(
          'min-h-[calc(100dvh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] duration-300 ease-in-out',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        <DashboardFooter />
      </footer>
    </>
  );
}
