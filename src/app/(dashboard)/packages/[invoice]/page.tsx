import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { getPackage } from '@/lib/package/packages.query';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import InvoiceDownload from '@/components/package/invoice-download';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

interface InvoiceProps {
  params: {
    invoice: string;
  };
}

export default async function SinglePackage({
  params: { invoice },
}: InvoiceProps) {
  const data = await getPackage(invoice);
  if (!data) notFound();

  const calculateSubtotal = () => {
    return data.lineItems
      .reduce(
        (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
        0,
      )
      .toFixed(2);
  };
  return (
    <main className="mt-4 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/packages"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'flex items-center gap-1',
          )}
        >
          <ChevronLeft className="size-4" />
          <span>Packages</span>
        </Link>
        <Link
          aria-label="Download Invoice"
          href={`/api/v1/invoice/stream?code=${data.barcode}`}
          target="_blank"
          rel="noreferrer"
          download={data.barcode + '_invoice.pdf'}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Download (S3)
        </Link>
      </div>
      <div className="grid gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="relative flex items-center justify-between">
              <CardTitle>#{data.barcode}</CardTitle>
              <CardDescription className="absolute right-0 top-0 flex flex-row items-center gap-2 md:static">
                {/* <Button size="icon" variant="ghost">
                  <Download className="size-4" />
                </Button> */}
                <InvoiceDownload payload={data} />
                <Badge>{data.status}</Badge>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
              <div>
                <h3 className="font-medium">Package</h3>
                <p>
                  Issued:{' '}
                  <time>{format(new Date(data.createdAt), 'PPpp')}</time>
                </p>
                <div>
                  Updated:{' '}
                  <time>{format(new Date(data.updatedAt), 'PPpp')}</time>
                </div>
                <p>{data.label}</p>
              </div>
              <div>
                <h3 className="font-medium">Sender</h3>
                <p>
                  {data.sender.firstName} {data.sender.lastName}
                </p>
                <p>
                  <a href="mailto:john@example.com">{data.sender.email}</a>
                </p>
                <p>
                  <a href={`tel:+${data.sender.phone}`}>{data.sender.phone}</a>
                </p>
              </div>
              <div>
                <h3 className="font-medium">Recipient</h3>
                <p>
                  {data.receiver.firstName} {data.receiver.lastName}
                </p>
                <p>
                  <a href="mailto:jane@example.com">{data.receiver.email}</a>
                </p>
                <p>
                  <a href={`tel:+${data.receiver.phone}`}>
                    {data.receiver.phone}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-medium">Agent</h3>
                <p>
                  {data.agent.user.firstName} {data.agent.user.lastName}
                </p>
                <p>
                  <a href="mailto:jane@example.com">{data.agent.user.email}</a>
                </p>
                <p>
                  <a href={`tel:+${data.receiver.phone}`}>
                    {data.agent.user.phone}
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <address className="not-italic">
                  <div className="font-medium">
                    {data.sender.firstName} {data.sender.lastName}
                  </div>
                  <div>{data.billingAddress.addressLine1}</div>
                  <div>
                    {data.billingAddress.city}, {data.billingAddress.state}{' '}
                    {data.billingAddress.postalCode}
                  </div>
                  <div>{data.billingAddress.country}</div>
                </address>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="text-sm not-italic">
                <div className="font-medium">
                  {data.receiver.firstName} {data.receiver.lastName}
                </div>
                <div>{data.shippingAddress.addressLine1}</div>
                <div>
                  {data.shippingAddress.city}, {data.shippingAddress.state}{' '}
                  {data.shippingAddress.postalCode}
                </div>
                <div>{data.shippingAddress.country}</div>
              </address>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="hidden md:table-cell">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.cargoItem.name}</div>
                      <div className="line-clamp-2 text-sm text-muted-foreground">
                        {item.cargoItem.description
                          ? item.cargoItem.description
                          : `${item.cargoItem.name}- ${item.cargoItem.unit}/${item.cargoItem.rate}`}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>€{item.unitPrice}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      €
                      {(parseInt(item.cargoItem.rate) * item.quantity).toFixed(
                        2,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <div>Source Hub</div>
                  <div className="font-medium">{data.sourceHub.name}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Destination Hub</div>
                  <div className="font-medium">{data.destinationHub.name}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Delivery Zone</div>
                  <div className="font-medium">{data.deliveryZone.name}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Delivery Option</div>
                  <div className="font-medium">{data.deliveryOption.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <div>Subtotal</div>
                  <div className="font-medium">€{calculateSubtotal()}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Shipping</div>
                  <div className="font-medium">€0.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Discount</div>
                  <div className="font-medium">€{data?.discountAmount}</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <div>Total</div>
                  <div>€{data.totalAmount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
