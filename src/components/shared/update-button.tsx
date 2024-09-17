'use client';
import Link from 'next/link';
import { Edit, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateButtonProps {
  title: string;
}

export function UpdateButton({ title }: CreateButtonProps) {
  const pathname = usePathname();
  return (
    <Link
      href={pathname + '/update'}
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
    >
      <Edit className="mr-2 size-4" aria-hidden="true" />
      {title}
    </Link>
  );
}
