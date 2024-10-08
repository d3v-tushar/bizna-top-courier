import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLockBody } from '@/hooks/use-lock-body';

interface MobileNavProps {
  items: {
    title: string;
    href: string;
    disabled?: boolean;
  }[];
  children?: React.ReactNode;
}

export function MobileNav({ items, children }: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        'fixed inset-0 top-12 z-50 grid h-[calc(100vh-3rem)] grid-flow-row auto-rows-max overflow-auto bg-background/30 p-6 pb-32 backdrop-blur-sm animate-in slide-in-from-bottom-80 md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-sm">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href="/"
            className={cn(
              'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
            )}
          >
            Home
          </Link>
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
