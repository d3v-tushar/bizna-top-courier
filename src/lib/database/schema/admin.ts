import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { users } from './user';

// Admin Schema
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Admin Relations
export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
}));

// Admin Selection Model
export type IAdmin = InferSelectModel<typeof admins>;

// Admin Insertion Model
export type InsertAdmin = InferInsertModel<typeof admins>;
