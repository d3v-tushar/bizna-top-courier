import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { agents } from './agent';

// Address Schema
export const address = pgTable('address', {
  id: serial('id').primaryKey(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  union: varchar('union', { length: 256 }).notNull().default('N/A'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// Address Relations
// export const addressRelations = relations(address, ({ one }) => ({
//   agent: one(agents, {
//     fields: [address.id],
//     references: [agents.addressId],
//   }),
// }));

// Address Selection Model
export type IAddress = InferSelectModel<typeof address>;

// Address Insertion Modal
export type InsertAddress = InferInsertModel<typeof address>;
