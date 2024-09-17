import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { users } from './user';
import { address } from './address';
import { hubs } from './hub';
import { packages } from './package';

// Agent Schema
export const agents = pgTable(
  'agents',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    vatNumber: varchar('vat_number', { length: 100 }).notNull(), // Partita IVA (Italian VAT number)
    taxCode: varchar('tax_code', { length: 100 }).notNull(), // Codice Fiscale (Italian tax code)
    dateOfBirth: date('date_of_birth').notNull(),
    placeOfBirth: varchar('place_of_birth', { length: 256 }).notNull(),
    iban: varchar('iban', { length: 256 }).notNull(),
    passportNumber: varchar('passport_number', { length: 256 }),
    contractPdf: text('contract_pdf'), // PDF file url for the contract
    addressId: integer('address_id')
      .notNull()
      .references(() => address.id),
    hubId: integer('hub_id')
      .notNull()
      .references(() => hubs.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (agent) => {
    return {
      vatNumberIdx: uniqueIndex('vat_number_idx').on(agent.vatNumber),
      agentTaxCodeIdx: uniqueIndex('agent_tax_idx').on(agent.taxCode),
      passportNumberIdx: uniqueIndex('passport_number_idx').on(
        agent.passportNumber,
      ),
      ibanIdx: uniqueIndex('iban_idx').on(agent.iban),
    };
  },
);

// Agent Relations
export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  address: one(address, {
    fields: [agents.addressId],
    references: [address.id],
  }),
  hub: one(hubs, {
    fields: [agents.hubId],
    references: [hubs.id],
  }),
  packages: many(packages),
}));

// Agent Selection Model
export type IAgent = InferSelectModel<typeof agents>;

// Agent Insertion Model
export type InsertAgent = InferInsertModel<typeof agents>;
