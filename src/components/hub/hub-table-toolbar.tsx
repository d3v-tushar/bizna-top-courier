import { Search } from '@/components/shared/search';
import { CreateButton } from '../shared/create-button';

export function HubTableToolbar() {
  return (
    <section className="mb-4 flex items-center justify-between gap-2">
      <Search placeholder="Search Hub..." />
      <CreateButton />
    </section>
  );
}
