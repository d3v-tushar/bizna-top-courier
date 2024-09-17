import { Search } from '../shared/search';
import { DatePickerWithRange } from '../ui/date-range-picker';
import { CreateButton } from '../shared/create-button';
import TableFacedFilter from '../shared/table-faced-filter';

export async function PackageTableToolbar() {
  return (
    <section className="mb-4 flex flex-col gap-2 md:flex-row">
      <Search placeholder="Search Package..." />
      <TableFacedFilter />
      <DatePickerWithRange />
      <CreateButton title="Create Package" />
    </section>
  );
}
