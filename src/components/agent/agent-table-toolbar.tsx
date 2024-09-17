import { Search } from '@/components/shared/search';
import { CreateButton } from '../shared/create-button';

export function AgentTableToolbar() {
  return (
    <section className="mb-4 flex items-center justify-between gap-2">
      <Search placeholder="Search Agents..." />
      <CreateButton title="Create" />
    </section>
  );
}
