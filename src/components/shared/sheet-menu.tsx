'use client';
import Link from 'next/link';
import { MenuIcon, PanelsTopLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/shared/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

interface SheetMenuProps {
  role: 'CLIENT' | 'AGENT' | 'ADMIN' | undefined;
}

export function SheetMenu({ role }: SheetMenuProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-describedby="dashboard navigation"
        className="flex h-full flex-col px-3 sm:w-72"
        side="left"
      >
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <h1 className="text-lg font-bold">BiznaTop</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu role={role} isOpen setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
