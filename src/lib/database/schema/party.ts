import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { partyType } from './enum';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// Party Schema
export const party = pgTable('party', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  phone: varchar('phone', { length: 16 }).notNull(), // Phone number with country code.
  email: varchar('email', { length: 256 }).notNull(),
  type: partyType('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Party Selection Model
export type IParty = InferSelectModel<typeof party>;

// Party Insertion Modal
export type InsertParty = InferInsertModel<typeof party>;
