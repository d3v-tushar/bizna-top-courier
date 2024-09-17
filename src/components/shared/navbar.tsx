import { ModeToggle } from '@/components/shared/mode-toggle';
import { UserNav } from '@/components/shared/user-nav';
import { SheetMenu } from '@/components/shared/sheet-menu';

interface NavbarProps {
  user: {
    role: 'CLIENT' | 'AGENT' | 'ADMIN';
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    imageUrl: string | null;
  } | null;
}

export async function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu role={user?.role} />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
