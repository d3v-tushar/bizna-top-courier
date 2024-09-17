import PackageTable from '@/components/package/package-table';
import { PACKAGE_LABEL, PACKAGE_STATUS } from '@/lib/package/package.constants';
import { getAllPackages } from '@/lib/package/packages.query';
import { z } from 'zod';

const isValidDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr);
};

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')
  .refine(isValidDate, 'Invalid date. Please provide a valid date.');

const PaginationSearchSchema = z
  .object({
    query: z
      .string()
      .trim()
      .optional()
      .describe('Optional search query string'),
    page: z.coerce
      .number()
      .int()
      .positive()
      .default(1)
      .describe('The current page number'),
    pageSize: z.coerce
      .number()
      .int()
      .positive()
      .default(10)
      .describe('Number of items per page'),
    status: z.enum(PACKAGE_STATUS).optional(),
    label: z.enum(PACKAGE_LABEL).optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    },
  );

function parseSearchParams(searchParams: {
  [key: string]: string | undefined;
}) {
  try {
    const parsedParams = PaginationSearchSchema.parse(searchParams);
    return parsedParams;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid search parameters:', error.errors);
    } else {
      console.error('Unexpected error during search parameter parsing:', error);
    }
    return {
      query: '',
      page: 1,
      pageSize: 10,
    }; // Return default values
  }
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page, pageSize, query, status, label, startDate, endDate } =
    parseSearchParams(searchParams);
  const packageList = await getAllPackages({
    page,
    limit: pageSize,
    query,
    status,
    label,
    startDate,
    endDate,
  });
  return <PackageTable packages={packageList} />;
}
