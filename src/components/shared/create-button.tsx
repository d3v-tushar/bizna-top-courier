'use client';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface CreateButtonProps {
  title?: string;
}

export function CreateButton({ title = 'Create' }: CreateButtonProps) {
  const pathname = usePathname();
  return (
    <Link
      href={pathname + '/create'}
      className="ml-auto flex h-8 items-center rounded-md border border-input bg-background px-4 py-2 text-xs shadow-sm hover:bg-accent hover:text-accent-foreground"
    >
      <Plus className="mr-0 size-4 md:mr-2" aria-hidden="true" />
      <span className="hidden md:block">{title}</span>
    </Link>
  );
}
