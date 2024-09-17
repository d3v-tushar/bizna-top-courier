import { Search } from '@/components/shared/search';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPackage } from '@/lib/package/packages.query';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Tracking',
};

export const revalidate = 0; // 10 minutes
const PaginationSearchSchema = z.object({
  query: z.string().trim().optional().describe('Optional search query string'),
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
});

function parseSearchParams(searchParams: {
  [key: string]: string | undefined;
}) {
  try {
    const parsedParams = PaginationSearchSchema.parse(searchParams);
    return parsedParams;
  } catch (error) {
    console.error('Invalid search parameters:', error);
    return {
      query: '',
      page: 1,
      pageSize: 10,
    }; // Return default values or handle as needed
  }
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query } = parseSearchParams(searchParams);
  let packageData = null;
  if (query && query.length > 12) packageData = await getPackage(query);
  return (
    <section className="container flex flex-col gap-6 px-4 py-4 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 p-2">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Track Your Package
        </h2>
        <p className="text-sm leading-normal text-muted-foreground md:text-lg md:leading-7">
          Enter your tracking number below to get the latest updates on your
          package. Our tracking system provides the most accurate and up-to-date
          information on your shipment.
        </p>
      </div>
      <div className="mx-auto mt-6 w-full space-y-4 overflow-x-auto p-2 md:max-w-[64rem]">
        <form
          lang="en"
          className="flex flex-col items-center gap-2 md:flex-row"
          action="/tracking"
          method="GET"
        >
          <Input
            name="query"
            minLength={10}
            maxLength={16}
            pattern="[0-9A-Z]{10,16}"
            defaultValue={query}
            placeholder="Enter your tracking number"
            required
          />
          <Button className="w-full max-w-xs" type="submit">
            Track Package
          </Button>
        </form>

        {packageData && (
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="relative flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  {packageData.barcode}
                </CardTitle>
                <CardDescription>
                  Date:{' '}
                  {format(new Date(packageData.createdAt), 'MMMM dd, yyyy')}
                </CardDescription>
              </div>
              <div className="absolute right-3 top-1 flex items-center gap-1">
                <Badge className="px-2 py-1 text-xs font-medium capitalize">
                  {packageData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Package Details</div>
                <ul className="grid gap-3">
                  {packageData.lineItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">
                        {item.cargoItem.name} x <span>{item.quantity}</span>
                      </span>
                      <span>
                        €
                        {(parseFloat(item.unitPrice) * item.quantity).toFixed(
                          2,
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      €
                      {packageData.lineItems
                        .reduce(
                          (sum, item) =>
                            sum + parseFloat(item.unitPrice) * item.quantity,
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>€{packageData.discountAmount}</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>€{packageData.totalAmount}</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Shipping Information</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  <span>
                    {packageData.sender.firstName} {packageData.sender.lastName}
                  </span>
                  <span>{packageData.shippingAddress.addressLine1}</span>
                  <span>
                    {packageData.shippingAddress.city},
                    {packageData.shippingAddress.state}
                    {packageData.shippingAddress.postalCode}
                  </span>
                </address>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Recipient Information</div>
                <dl className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Recipient</dt>
                    <dd>
                      {packageData.sender.firstName}{' '}
                      {packageData.sender.lastName}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a href="mailto:">{packageData.sender.email}</a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">{packageData.sender.phone}</a>
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Last Updated{' '}
                <time dateTime="2023-11-23">
                  {format(new Date(packageData.updatedAt), 'MMMM dd, yyyy')}
                </time>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      <div className="mx-auto w-full p-2 md:max-w-[64rem]">
        <p className="text-justify leading-normal text-muted-foreground sm:leading-7">
          Whether it&apos;s on its way or has already been delivered,
          you&apos;ll know <strong>Track your package with ease</strong>,
        </p>
      </div>
    </section>
  );
}
