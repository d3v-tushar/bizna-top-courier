'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

export function Search({
  className,
  placeholder = 'Search',
}: {
  className?: string;
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="search"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        type="search"
        placeholder={placeholder}
        className={cn('h-8 w-full pl-10 lg:w-[300px]', className)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
