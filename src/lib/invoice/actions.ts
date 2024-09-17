// import 'server-only';
// import db from '../database';
// import { ClientInvoices, Invoice } from '../database/schema/invoice';
// import { Client, Package, PackageItem, User } from '../database/schema';
// import { eq } from 'drizzle-orm';
// import { Sender } from '../database/schema/sender';
// import { invoicesData } from './constants';

// export async function getInvoices() {
//   return { data: invoicesData, pageCount: 2 };
// }

// export async function getClientInvoices(userId: number) {
//   ////Option 1
//   // return await db
//   //   .select()
//   //   .from(Invoice)
//   //   .innerJoin(Package, eq(Invoice.packageId, Package.id))
//   //   .leftJoin(PackageItem, eq(Package.id, PackageItem.packageId))
//   // .innerJoin(Sender, eq(Invoice.senderId, Sender.id))
//   // .innerJoin(Client, eq(Sender.clientId, Client.id))
//   // .where(eq(Client.id, userId));
//   ////Option 2
//   // return await db.query.Client.findMany({
//   //   columns: {
//   //     id: true,
//   //   },
//   //   with: {
//   //     sender: {
//   //       where: (sender, { eq }) => eq(sender.clientId, userId),
//   //     },
//   //   },
//   //   // where: (invoice, { eq }) => eq(invoice.userId, userId),
//   // });
//   //// Option 3
//   // return await db.query.ClientInvoices.findMany({
//   //   with: {
//   //     invoice: {
//   //       with: {
//   //         package: true,
//   //       },
//   //     },
//   //     client: {
//   //       columns: {
//   //         userId: true,
//   //       },
//   //     },
//   //   },
//   //   where: (client, { eq }) => eq(client.clientId, userId),
//   // });
//   ////option 4
//   // return await db
//   //   .select({ invoice: Invoice })
//   //   .from(ClientInvoices)
//   //   .innerJoin(Client, eq(Client.id, ClientInvoices.clientId))
//   //   .innerJoin(Invoice, eq(Invoice.id, ClientInvoices.invoiceId))
//   //   .where(eq(Client.userId, userId));

//   //Option 5
//   return await db.query.Client.findMany({
//     columns: {},
//     with: {
//       sender: {
//         columns: {
//           id: true,
//         },
//         with: {
//           invoice: true,
//           address: true,
//         },
//       },
//     },
//     where: (client, { eq }) => eq(client.userId, userId),
//   });
// }
