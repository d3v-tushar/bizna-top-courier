'use client';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export function RefreshButton() {
  const { refresh } = useRouter();
  const [refreshCount, setRefreshCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldown > 0) {
      setIsDisabled(true);
      timer = setTimeout(() => {
        setCooldown(cooldown - 1);
        if (cooldown === 1) {
          setIsDisabled(false);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [cooldown]);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
    refresh();
    toast.success(`Revalidated on ${format(new Date(), 'PPpp')}`);

    switch (refreshCount) {
      case 0:
        setCooldown(5);
        break;
      case 1:
        setCooldown(15);
        break;
      case 2:
        setCooldown(30);
        break;
      case 3:
        setCooldown(60);
        break;
      default:
        setCooldown(0);
        setRefreshCount(0);
        break;
    }
  };

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        if (!isDisabled) {
          handleRefresh();
        }
      }}
    >
      <Button
        type="submit"
        role="refresh"
        variant="outline"
        size="sm"
        className="flex h-8 items-center active:[&>*:nth-child(odd)]:animate-spin"
        disabled={isDisabled}
      >
        <ReloadIcon className="size-4" />
      </Button>
    </form>
  );
}
