'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export default function DashboardPageTemplete({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const currentPage = pathname.split('/').pop() || 'Dashboard';
  const pathSegments = pathname.split('/').filter(Boolean);
  return (
    <div className="px-4 pb-6 pt-6 sm:px-8">
      <Breadcrumb>
        <BreadcrumbList className="capitalize">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/overview">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;
            return (
              <Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{segment}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
}
