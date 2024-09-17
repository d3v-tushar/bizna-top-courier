import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

// Delivery option table schema
export const deliveryZone = pgTable(
  'delivery_zone',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (zone) => {
    return {
      zoneIdx: uniqueIndex('zone_name_idx').on(zone.name),
    };
  },
);

// Delivery option table schema
export const deliveryOption = pgTable(
  'delivery_option',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    shippingCharge: decimal('shipping_charge', {
      precision: 10,
      scale: 2,
    }).default('0'),
    deliveryZoneId: integer('drlivery_zone_id')
      .notNull()
      .references(() => deliveryZone.id),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (option) => {
    return {
      zoneIdx: uniqueIndex('option_name_idx').on(option.name),
    };
  },
);

// Delivery Zone Relations
export const deliveryZoneRelations = relations(deliveryZone, ({ many }) => ({
  deliveryOption: many(deliveryOption),
}));

// Delivery Option Relations
export const deliveryOptionRelations = relations(deliveryOption, ({ one }) => ({
  deliveryZone: one(deliveryZone, {
    fields: [deliveryOption.deliveryZoneId],
    references: [deliveryZone.id],
  }),
}));

// Delivery Zone Selection Model
export type IDeliveryZone = InferSelectModel<typeof deliveryZone>;

// Delivery Option Selection Model
export type IDeliveryOption = InferSelectModel<typeof deliveryOption>;

// Delivery Zone Insertion Model
export type InsertDeliveryZone = InferInsertModel<typeof deliveryZone>;

// Delivery Option Insertion Model
export type InsertDeliveryOption = InferInsertModel<typeof deliveryOption>;
