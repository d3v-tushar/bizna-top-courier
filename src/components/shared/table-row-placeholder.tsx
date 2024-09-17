import { TableCell, TableRow } from '@/components/ui/table';

export function TableRowPlaceholder({
  totalRows = 10,
  filledRows,
}: {
  totalRows: number;
  filledRows: number;
}) {
  const emptyRows = totalRows - filledRows;
  return (
    <>
      {totalRows === emptyRows ? (
        <TableRow>
          <TableCell
            colSpan={8}
            className="h-60 text-center text-base md:h-[400px]"
          >
            No results.
          </TableCell>
        </TableRow>
      ) : (
        <>
          <TableRow>
            <TableCell
              colSpan={8}
              className="h-[calc(75dvh_-_20rem)] text-center text-base"
            />
          </TableRow>
        </>
      )}
    </>
  );
}
