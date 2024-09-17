'use client';

import { type ElementRef, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { useLockBody } from '@/hooks/use-lock-body';

export function Modal({ children }: { children: React.ReactNode }) {
  useLockBody();
  const { back } = useRouter();
  const dialogRef = useRef<ElementRef<'dialog'>>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    back();
  }

  return createPortal(
    <div className="absolute inset-0 z-[999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black/70 backdrop-blur-sm">
      <dialog
        ref={dialogRef}
        className="relative bg-transparent"
        onClose={onDismiss}
      >
        <div className="rounded-md bg-background p-4 shadow-md">{children}</div>
        <button
          type="button"
          aria-label="Close modal"
          title="Close modal"
          onClick={onDismiss}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'absolute right-2 top-2 z-10',
          )}
        >
          <X className="size-4" />
        </button>
      </dialog>
    </div>,
    document.getElementById('modal-root')!,
  );
}
