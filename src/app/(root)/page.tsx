import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Handshake,
  Headset,
  LocateFixed,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import ShimmerButton from '@/components/ui/shimmer-button';

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href="https://www.x.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ShimmerButton
              role="link"
              className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium dark:text-white"
            >
              Follow along on Twitter
            </ShimmerButton>
          </Link>

          <h1
            className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm sm:text-5xl md:text-7xl/[5rem]"
            style={{ animationDelay: '0.20s', animationFillMode: 'forwards' }}
          >
            Most Trusted Bridge For Sending Goods To Bangladesh
          </h1>
          <p className="mt-2.5 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Experience the future of package delivery with BiznaTop&apos;s
            cutting-edge features and services.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: 'lg' }))}>
              Get Started
            </Link>
            <Link
              href="/find-hub"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Find Hubs
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] capitalize leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Streamline Your Courier Management.
            <span className="hidden md:block">
              Our powerful courier management system helps you track, manage and
              optimize your delivery operations.
            </span>
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <ShieldCheck className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Fast & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Offering a service that consolidates multiple packages into
                  one shipment
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Handshake className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Insurance Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive pricing for shipments with insurance coverage.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <LocateFixed className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Package Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Easy Tracking with shipment status throughout the delivery
                  process.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Sparkles className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Loyalty Program</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  Reward customers with discounts or special offers, encouraging
                  customer retention.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <MapPinned className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Localized Delivery</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  Partnering with local delivery services to ensure efficient
                  last-mile delivery
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Headset className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Customer Support</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  Assist with inquiries, provide updates & resolve any issues
                  related to shipments.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            BiznaTop Mobile App that allows customers to book shipments, track
            packages, and manage their accounts, invoices easily on the go.
          </p>
        </div>
      </section>
    </>
  );
}
