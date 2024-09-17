import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { MainNav } from '@/components/shared/main-nav';
import { SiteFooter } from '@/components/shared/site-footer';
import dynamic from 'next/dynamic';

const DynamicPWAInstall = dynamic(
  () => import('@/components/shared/pwa-install-button'),
  {
    ssr: false,
  },
);

const Particles = dynamic(() => import('@/components/ui/particles'), {
  ssr: false,
});

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const menus = [
    {
      title: 'Features',
      href: '/#features',
    },

    {
      title: 'Pricing',
      href: '/pricing',
    },
    {
      title: 'Tracking',
      href: '/tracking',
    },
    {
      title: 'Find Hub',
      href: '/find-hub',
    },
    {
      title: 'Privacy Policy',
      href: '/privacy',
    },
  ];
  return (
    <div className="flex min-h-[100dvh] flex-col bg-map bg-cover bg-fixed bg-center bg-no-repeat dark:bg-none">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 hidden transform-gpu overflow-hidden blur-3xl dark:block sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <header className="sticky top-0 z-10 w-full bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <div className="container flex h-14 items-center justify-between py-6 md:h-[70px]">
          <MainNav items={menus} />
          <nav className="flex items-center gap-2">
            <DynamicPWAInstall />
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'px-4',
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Particles
        className="absolute inset-0 -z-10 hidden dark:block"
        quantity={100}
        ease={80}
        color='#ffffff"'
        refresh
      />
    </div>
  );
}
