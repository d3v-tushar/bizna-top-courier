import CargoTable from '@/components/cargo/cargo-table';
import { getCargoItemList } from '@/lib/cargo/cargo.query';

export default async function CargoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query, page = 1 } = searchParams;
  const cargoItems = await getCargoItemList(query, Number(page));
  return <CargoTable cargoItems={cargoItems} />;
}
