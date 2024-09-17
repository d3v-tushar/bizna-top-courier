import { Search } from '@/components/shared/search';

import { CreateButton } from '../shared/create-button';

export function AdminTableToolbar() {
  return (
    <section className="mb-4 flex items-center justify-between gap-2">
      <Search placeholder="Search Admins..." />
      <CreateButton title="Create" />
    </section>
  );
}
