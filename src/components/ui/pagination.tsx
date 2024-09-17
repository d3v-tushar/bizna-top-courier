'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  const navigateToPage = (page: number | string) => {
    router.push(`?page=${page}`);
  };
  return (
    // <section className="flex items-center justify-end gap-2.5">
    //   <div className="flex w-[100px] items-center justify-center text-sm font-medium">
    //     Page 1 of 12
    //   </div>
    //   <div className="flex items-center space-x-2">
    //     <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex">
    //       <span className="sr-only">Go to first page</span>
    //       <DoubleArrowLeftIcon className="h-4 w-4" />
    //     </Button>
    //     <Button variant="outline" className="h-8 w-8 p-0">
    //       <span className="sr-only">Go to previous page</span>
    //       <ChevronLeftIcon className="h-4 w-4" />
    //     </Button>
    //     <Button variant="outline" className="h-8 w-8 p-0">
    //       <span className="sr-only">Go to next page</span>
    //       <ChevronRightIcon className="h-4 w-4" />
    //     </Button>
    //     <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex">
    //       <span className="sr-only">Go to last page</span>
    //       <DoubleArrowRightIcon className="h-4 w-4" />
    //     </Button>
    //   </div>
    // </section>

    <section className="flex items-center justify-end gap-2.5">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => navigateToPage(1)}
          disabled={page === 1}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => navigateToPage(page - 1)}
          disabled={page === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => navigateToPage(page + 1)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => navigateToPage(totalPages)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
