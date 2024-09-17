import {
  decimal,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// Coupon Schema
export const coupons = pgTable(
  'coupons',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    value: decimal('value', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiredAt: timestamp('expired_at').notNull(),
  },
  (coupon) => {
    return {
      codeIndex: uniqueIndex('idx_coupons_code').on(coupon.name),
    };
  },
);

// Invoice Selection Model
export type ICoupon = InferSelectModel<typeof coupons>;

// Invoice Insertion Model
export type InsertCoupon = InferInsertModel<typeof coupons>;
