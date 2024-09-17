import InvoiceBarcode from '@/components/invoice/invoice-barcode';
import InvoiceDownload from '@/components/package/invoice-download';
import { getPackage } from '@/lib/package/packages.query';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

interface InvoiceProps {
  params: {
    invoice: string;
  };
}

const InvoiceTemplate = async ({ params: { invoice } }: InvoiceProps) => {
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
    <section className="overflow-auto">
      <div className="mt-4 flex aspect-[1/1.4142] min-w-[500px] max-w-lg flex-col rounded bg-white p-6 shadow">
        <div className="flex w-full items-start justify-between">
          <h1 className="text-xl font-bold text-gray-600">BIZNATOP</h1>

          <div className="-mt-4 flex flex-col items-end">
            <InvoiceBarcode barcode={data.barcode} />
            <h2 className="text-lg font-bold text-gray-600">#INVOICE</h2>
            <span className="text-sm text-gray-500">{data.barcode}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">Bill to:</h3>
          <h3 className="text-sm font-semibold text-gray-800">
            {data.receiver.firstName} {data.receiver.lastName}
          </h3>
          <address className="mt-2 text-sm not-italic text-gray-500">
            {data.shippingAddress.addressLine1}
            <br />
            {data.shippingAddress.city}, {data.shippingAddress.state}
            <br />
            {data.shippingAddress.postalCode}, {data.shippingAddress.country}
            <br />
          </address>
        </div>

        <div className="mt-6 text-sm">
          <div className="space-y-4 rounded-md border border-gray-200 p-4">
            <div className="grid grid-cols-5">
              <div className="col-span-2 text-xs font-medium uppercase text-gray-500">
                Item
              </div>
              <div className="text-start text-xs font-medium uppercase">
                Qty
              </div>
              <div className="text-start text-xs font-medium uppercase text-gray-500">
                Rate
              </div>
              <div className="text-end text-xs font-medium uppercase text-gray-500">
                Amount
              </div>
            </div>
            <div className="hidden border-b border-gray-200 sm:block"></div>
            {data.lineItems.map((item, index) => (
              <Fragment key={index}>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <p className="font-medium text-gray-800">
                      # {item.cargoItem.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-800">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-800">{item.unitPrice}</p>
                  </div>
                  <div>
                    <p className="text-end text-gray-800">
                      ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="border-b border-gray-200 sm:hidden"></div>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="mt-4 flex sm:justify-end">
          <div className="w-full max-w-2xl space-y-2 sm:text-end">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-1 sm:gap-2">
              <dl className="grid gap-x-3 sm:grid-cols-5">
                <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">
                  Subtotal:
                </dt>
                <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                  ${calculateSubtotal()}
                </dd>
              </dl>
              <dl className="grid gap-x-3 sm:grid-cols-5">
                <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">
                  Discount:
                </dt>
                <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                  ${data.discountAmount || '0.00'}
                </dd>
              </dl>
              <dl className="grid gap-x-3 sm:grid-cols-5">
                <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">
                  Total:
                </dt>
                <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                  ${data.totalAmount}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <h4 className="font-semibold text-gray-800">Thank you!</h4>
          <p className="text-xs text-gray-500 dark:text-neutral-500">
            If you have any questions concerning this invoice, use the following
            contact information:
          </p>
          <div className="mt-2">
            <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
              support@biznatop.com
            </p>
            <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
              +1 (062) 109-9222
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-gray-500 dark:text-neutral-500">
          © 2024 Biznatop.
        </p>
      </div>
      <InvoiceDownload payload={data} />
    </section>
  );
};

export default InvoiceTemplate;
