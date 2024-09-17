'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ActionItem({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={pathname + href}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
    >
      {label}
    </Link>
  );
}
