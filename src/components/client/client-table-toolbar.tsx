import { Search } from '@/components/shared/search';

import { CreateButton } from '../shared/create-button';

export function ClientTableToolbar() {
  return (
    <section className="mb-4 flex items-center justify-between gap-2">
      <Search placeholder="Search Clients..." />
      <CreateButton title="Create" />
    </section>
  );
}
