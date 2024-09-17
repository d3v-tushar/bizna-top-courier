import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { signout } from '@/lib/auth/actions';
import { verifySession } from '@/lib/auth/dal';
import db from '@/lib/database';
import { format } from 'date-fns';
import { ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

async function clientPackages() {
  try {
    const session = await verifySession();
    if (!session) {
      return null;
    }
    const clientPackages = await db.query.clients.findFirst({
      with: {
        user: {
          columns: { firstName: true, lastName: true },
        },
        packages: {
          with: {
            sender: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
            receiver: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      where: (client, { eq }) => eq(client.userId, Number(session.userId)),
    });
    if (!clientPackages) {
      return null;
    }
    return clientPackages;
  } catch (error) {
    console.log('failed to get client packages', error);
    return null;
  }
}

export default async function MyPackages() {
  const clientWithPackages = await clientPackages();
  return (
    <main className="flex min-h-[100dvh] flex-col">
      <section className="container flex flex-col gap-6 px-4 py-4 md:max-w-[64rem] md:py-12 lg:py-24">
        <div className="relative mx-auto flex w-full animate-fade-up flex-col gap-4 p-2 md:px-0 md:py-2">
          <h3 className="font-heading text-lg leading-[1.1]">Welcome Back,</h3>
          <h2 className="font-heading text-3xl leading-[1.1]">
            {`${clientWithPackages?.user.firstName} ${clientWithPackages?.user.lastName}`}
          </h2>
          <p className="text-sm leading-normal text-muted-foreground md:text-base md:leading-7">
            Find all your packages below. For any questions about your package
            or to arrange future shipments, please don&apos;t hesitate to
            contact our customer support team. We&pos;re here to ensure your
            shipping experience is smooth and transparent from start to finish.
          </p>
          <form className="absolute right-0 top-0" action={signout}>
            <Button size="sm" type="submit">
              Logout
            </Button>
          </form>
        </div>
        <div className="mx-auto mt-6 w-full overflow-x-auto rounded-md border border-muted-foreground/20 md:max-w-[64rem]">
          {clientWithPackages?.packages ? (
            <>
              {clientWithPackages.packages.map((pkg) => (
                <div key={pkg.id} className="w-full p-4">
                  <header className="mb-6 flex items-center justify-between">
                    <h2 className="flex items-center text-xl font-bold">
                      <Package className="mr-2" aria-hidden="true" />
                      <span>PKG#{pkg.id}</span>
                    </h2>
                    <Badge>{pkg.status}</Badge>
                  </header>

                  <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        className="mb-1 text-sm text-gray-400"
                        htmlFor="tracking-number"
                      >
                        Tracking Number
                      </label>
                      <p id="tracking-number" className="font-medium">
                        #{pkg.barcode}
                      </p>
                    </div>
                    <div>
                      <label
                        className="mb-1 text-sm text-gray-400"
                        htmlFor="date"
                      >
                        Date
                      </label>
                      <p id="date" className="font-medium">
                        {format(new Date(pkg.createdAt), 'PPpp')}
                      </p>
                    </div>
                    <div>
                      <label
                        className="mb-1 text-sm text-gray-400"
                        htmlFor="sender"
                      >
                        Sender
                      </label>
                      <p id="sender" className="font-medium">
                        {`${pkg.sender.firstName} ${pkg.sender.lastName}`}
                      </p>
                    </div>
                    <div>
                      <label
                        className="mb-1 text-sm text-gray-400"
                        htmlFor="recipient"
                      >
                        Recipient
                      </label>
                      <p id="recipient" className="font-medium">
                        {`${pkg.receiver.firstName} ${pkg.receiver.lastName}`}
                      </p>
                    </div>
                  </section>

                  <section className="mb-6 flex flex-col items-center justify-between text-left md:flex-row">
                    <div>
                      <label
                        className="mb-1 text-sm text-gray-400"
                        htmlFor="from"
                      >
                        From
                      </label>
                      <p id="from" className="font-medium">
                        Italy
                      </p>
                    </div>
                    <ArrowRight
                      className="hidden text-gray-400 md:block"
                      aria-hidden="true"
                    />
                    <div>
                      <label
                        className="mb-1 text-sm text-gray-400"
                        htmlFor="to"
                      >
                        To
                      </label>
                      <p id="to" className="font-medium">
                        Bangladesh
                      </p>
                    </div>
                  </section>

                  <footer className="flex items-center justify-between border-t border-gray-700 pt-6">
                    <p className="text-gray-400">Total</p>
                    <p className="text-xl font-semibold">€{pkg.totalAmount}</p>
                  </footer>
                </div>
              ))}
            </>
          ) : (
            <div className="mt-6 flex h-40 w-full items-center justify-center md:max-w-[64rem]">
              <h3 className="text-center font-medium text-muted-foreground">
                You don&apos;t have any packages yet. Visit your nearest{' '}
                <Link href="/find-hub" className="underline">
                  Hub
                </Link>
              </h3>
            </div>
          )}
        </div>

        <div className="mx-auto w-full p-2 md:max-w-[64rem]">
          <p className="text-justify leading-normal text-muted-foreground sm:leading-7">
            Thank you for choosing our services for your international shipping
            needs. We appreciate your trust in us to deliver your valuable items
            safely and efficiently across borders.{' '}
            <strong>
              Visit your nearest{' '}
              <Link href="/find-hub" className="underline">
                hub
              </Link>
            </strong>
          </p>
        </div>
      </section>
    </main>
  );
}
