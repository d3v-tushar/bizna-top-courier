import {
  boolean,
  decimal,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { packageItem } from './package';

// Cargo Item Schema
export const cargoItem = pgTable(
  'cargo_item',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    unit: varchar('unit', { length: 100 }).notNull(),
    rate: decimal('rate').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (item) => {
    return {
      cargoNameIdx: uniqueIndex('cargo_name_idx').on(item.name),
    };
  },
);

// Cargo Item Relations
export const cargoItemRelations = relations(cargoItem, ({ many }) => ({
  packageItem: many(packageItem),
}));

// Cargo Item Selection Model
export type ICargoItem = InferSelectModel<typeof cargoItem>;

// Cargo Insertion Model
export type InsertCargoItem = InferInsertModel<typeof cargoItem>;
