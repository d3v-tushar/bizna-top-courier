import { PackageForm } from '@/components/package/package-form';
import { getCargoItems } from '@/lib/cargo/cargo.query';
import { getZoneWithOptions } from '@/lib/delivery/delivery.query';
import { getHubs } from '@/lib/hub/hub.query';
import { findClient } from '@/lib/user/user.query';
import { z } from 'zod';

const PaginationSearchSchema = z.object({
  clientQuery: z
    .string()
    .trim()
    .optional()
    .describe('Optional search query string'),
  cargoQuery: z
    .string()
    .trim()
    .optional()
    .describe('Optional search query string'),
  hubQuery: z
    .string()
    .trim()
    .optional()
    .describe('Optional search query string'),
  zoneQuery: z
    .string()
    .trim()
    .optional()
    .describe('Optional search query string'),
});

function parseSearchParams(searchParams: {
  [key: string]: string | undefined;
}) {
  try {
    const parsedParams = PaginationSearchSchema.parse(searchParams);
    return parsedParams;
  } catch (error) {
    console.error('Invalid search parameters:', error);
    return {};
  }
}

export default async function CreatePackagePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { clientQuery, cargoQuery, hubQuery, zoneQuery } =
    parseSearchParams(searchParams);

  // Wait for all promises to resolve before rendering the page
  const [clientList, cargoItemList, hubList, zoneWithOptionList] =
    await Promise.all([
      findClient(clientQuery),
      getCargoItems(cargoQuery),
      getHubs(hubQuery),
      getZoneWithOptions(zoneQuery),
    ]);

  return (
    <PackageForm
      clientList={clientList}
      cargoItemList={cargoItemList}
      hubList={hubList}
      zoneWithOptionList={zoneWithOptionList}
    />
  );
}
