import { CreateButton } from '../shared/create-button';
import { Search } from '../shared/search';

export function CargoTableToolbar() {
  return (
    <section className="mb-4 flex items-center justify-between gap-2">
      <Search placeholder="Search Cargo Item..." />
      <CreateButton />
    </section>
  );
}
