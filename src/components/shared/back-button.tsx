'use client';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackButton({ className }: { className?: string }) {
  const { back } = useRouter();
  return (
    <Button
      size="sm"
      onClick={back}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        className,
        'flex items-center',
      )}
    >
      <ChevronLeft className="mr-2 mt-0.5 size-4" />
      <span>Back</span>
    </Button>
  );
}
