import { CreateButton } from '@/components/shared/create-button';
import { Search } from '@/components/shared/search';
import { cn } from '@/lib/utils';
import { RefreshButton } from '@/components/shared/refresh-button';

interface TableToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <section
      className={cn(className, 'mb-4 flex items-center justify-between gap-2')}
    >
      <Search placeholder="Search..." />
      {children}
      <RefreshButton />
      <CreateButton />
    </section>
  );
}
