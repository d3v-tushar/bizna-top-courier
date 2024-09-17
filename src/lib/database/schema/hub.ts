import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { agents } from './agent';
import { address } from './address';

//Hub Schema
export const hubs = pgTable(
  'hubs',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    addressId: integer('address_id')
      .notNull()
      .references(() => address.id),
    latitude: text('latitude').notNull(),
    longitude: text('longitude').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (hub) => {
    return {
      nameIndex: uniqueIndex('hub_name_idx').on(hub.name),
    };
  },
);

//Hub Relations
export const hubsRelations = relations(hubs, ({ one, many }) => ({
  agents: many(agents),
  address: one(address, {
    fields: [hubs.addressId],
    references: [address.id],
  }),
  // Todo: Resolve Hubs for Packages. Source Hub / Destination Hub
}));

// Hub Selection Model
export type IHub = InferSelectModel<typeof hubs>;

// Hub Insertion Model
export type InsertHub = InferInsertModel<typeof hubs>;
