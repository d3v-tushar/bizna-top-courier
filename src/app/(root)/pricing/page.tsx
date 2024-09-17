import db from '@/lib/database';
import { format } from 'date-fns';

export const metadata = {
  title: 'Pricing',
};

export const revalidate = 3600; // 1 hour

export default async function PricingPage() {
  const cargoItems = await db.query.cargoItem.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    where: (cargoItem, { eq }) => eq(cargoItem.isActive, true),
  });
  return (
    <section className="container flex flex-col gap-6 px-4 py-4 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full animate-fade-up flex-col gap-4 p-2 md:px-0 md:py-2">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Simple, transparent pricing
        </h2>
        <p className="text-sm leading-normal text-muted-foreground md:text-lg md:leading-7">
          Our transparent pricing for all your shipping needs.
        </p>
      </div>
      <div className="mx-auto mt-6 w-full overflow-x-auto rounded-md border border-muted-foreground/20 md:max-w-[64rem]">
        {cargoItems.length ? (
          <table className="w-full border-collapse text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Cargo Type
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Unit
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {cargoItems?.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-muted/20 even:bg-muted/10"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="line-clamp-1 text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.unit}</td>
                  <td className="px-4 py-3 font-medium">€{item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-6 flex h-40 w-full items-center justify-center md:max-w-[64rem]">
            <h3 className="text-center font-medium text-muted-foreground">
              No cargo rates available at the moment. Please check back later or
              add new cargo rates.
            </h3>
          </div>
        )}
      </div>
      <span className="ml-auto text-xs text-muted-foreground">
        Last Updated: {format(new Date(), 'dd MMM yyyy hh:mm a')}
      </span>
      <div className="mx-auto w-full p-2 md:max-w-[64rem]">
        <p className="text-justify leading-normal text-muted-foreground sm:leading-7">
          These rates apply to all shipments from Italy to Bangladesh, ensuring
          you receive the best value for your money.{' '}
          <strong>
            No hidden fees, just clear and honest pricing for all your shipping
            needs.
          </strong>
        </p>
      </div>
    </section>
  );
}
