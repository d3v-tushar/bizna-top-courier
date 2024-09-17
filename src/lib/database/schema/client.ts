import {
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { users } from './user';
import { packages } from './package';

// Client Schema
export const clients = pgTable(
  'clients',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    taxCode: varchar('tax_code', { length: 16 }).notNull(), // Codice Fiscale (Italian tax code)
    dateOfBirth: date('date_of_birth').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (client) => {
    return { taxCodeIdx: uniqueIndex('tax_code_idx').on(client.taxCode) }; // Unique constraint for the tax code(CF) column
  },
);

// Client Relations
export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  packages: many(packages),
}));

// Client Selection Model
export type IClient = InferSelectModel<typeof clients>;

// Client Insertion Model
export type InsertClient = InferInsertModel<typeof clients>;
