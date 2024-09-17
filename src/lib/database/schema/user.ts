import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { userRole } from './enum';
import { admins } from './admin';
import { clients } from './client';
import { agents } from './agent';

//User Schema
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 256 }).notNull(),
    lastName: varchar('last_name', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 16 }).notNull(), // Phone number with country code.
    email: varchar('email', { length: 256 }).notNull(),
    passwordHash: varchar('password_hash', { length: 256 }).notNull(),
    imageUrl: text('image_url'),
    role: userRole('role').default('CLIENT').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (user) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(user.email),
      phoneIdx: uniqueIndex('phone_idx').on(user.phone),
    };
  },
);

// User Relations
export const usersRelations = relations(users, ({ one }) => ({
  admin: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
  agent: one(agents, {
    fields: [users.id],
    references: [agents.userId],
  }),
  client: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),
}));

// User Selection Model
export type IUser = InferSelectModel<typeof users>;

// User Insertion Model
export type InsertUser = InferInsertModel<typeof users>;
