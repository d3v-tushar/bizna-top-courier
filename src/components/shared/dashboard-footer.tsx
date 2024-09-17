import Link from 'next/link';

export function DashboardFooter() {
  return (
    <div className="sticky bottom-0 z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex h-14 items-center justify-between md:mx-8">
        <p className="text-right text-xs leading-loose text-muted-foreground md:text-sm">
          Developed by{' '}
          <Link
            href="https://github.com/d3v-tushar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Tushar
          </Link>
          {' & '}
          <Link
            href="https://github.com/ashiksimanto"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Simanto
          </Link>
        </p>
      </div>
    </div>
  );
}
