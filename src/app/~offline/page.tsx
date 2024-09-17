import type { Metadata } from 'next';
import { WifiOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline',
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-md flex-col items-center justify-center">
        <WifiOff className="size-20" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, you&apos;re offline!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Please check your internet connection.
        </p>
      </section>
    </main>
  );
}
