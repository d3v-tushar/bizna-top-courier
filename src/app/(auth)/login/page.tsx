import { LoginForm } from '@/components/auth/login-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8',
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="text-sm">Back</span>
      </Link>
      <LoginForm />
    </main>
  );
}
