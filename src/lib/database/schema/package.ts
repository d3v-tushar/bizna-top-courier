import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

import { packagelabel, packageStatus, paymentMethod } from './enum';
import { hubs } from './hub';
import { cargoItem } from './cargo';
import { clients } from './client';
import { agents } from './agent';
import { address } from './address';
import { deliveryOption, deliveryZone } from './delivery';
import { party } from './party';

// Package Schema
export const packages = pgTable(
  'packages',
  {
    id: serial('id').primaryKey(),
    barcode: varchar('barcode', { length: 100 }).notNull(),
    status: packageStatus('status').notNull().default('in progress'),
    label: packagelabel('label').notNull().default('Received At Hub'),
    note: text('note'), // Note field for additional information.
    agentId: integer('agent_id')
      .notNull()
      .references(() => agents.id),
    clientId: integer('cient_id')
      .notNull()
      .references(() => clients.id),
    clientTaxCode: varchar('client_tax_code', { length: 256 }).notNull(),
    senderId: integer('sender')
      .notNull()
      .references(() => party.id),
    receiverId: integer('receiver')
      .notNull()
      .references(() => party.id),
    billingAddressId: integer('billing_address_id')
      .notNull()
      .references(() => address.id),
    shippingAddressId: integer('shipping_address_id')
      .notNull()
      .references(() => address.id),
    deliveryZoneId: integer('delivery_zone')
      .notNull()
      .references(() => deliveryZone.id),
    deliveryOptionId: integer('delivery_option')
      .notNull()
      .references(() => deliveryOption.id),
    discountAmount: decimal('discount_amount', {
      precision: 10,
      scale: 2,
    }).default('0'), // Default to 0 if not provided.
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    deliveryCost: decimal('delivery_cost', { precision: 10, scale: 2 }),
    paymentMethod: paymentMethod('payment_method').notNull(),
    sourceHubId: integer('source_hub_id')
      .notNull()
      .references(() => hubs.id),
    destinationHubId: integer('destination_hub_id')
      .notNull()
      .references(() => hubs.id),
    isArchived: boolean('is_archived').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (pkg) => {
    return {
      barcodeIdx: uniqueIndex('barcode_idx').on(pkg.barcode),
    };
  },
);

// Package Item Schema
export const packageItem = pgTable('package_item', {
  id: serial('id').primaryKey(),
  packageId: integer('package_id')
    .notNull()
    .references(() => packages.id),
  cargoItemId: integer('cargo_item_id')
    .notNull()
    .references(() => cargoItem.id),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Package Relations
export const packagesRelations = relations(packages, ({ one, many }) => ({
  agent: one(agents, {
    fields: [packages.agentId],
    references: [agents.id],
  }),
  client: one(clients, {
    fields: [packages.clientId],
    references: [clients.id],
  }),
  sender: one(party, {
    fields: [packages.senderId],
    references: [party.id],
  }),
  receiver: one(party, {
    fields: [packages.receiverId],
    references: [party.id],
  }),
  sourceHub: one(hubs, {
    fields: [packages.sourceHubId],
    references: [hubs.id],
  }),
  destinationHub: one(hubs, {
    fields: [packages.destinationHubId],
    references: [hubs.id],
  }),
  billingAddress: one(address, {
    fields: [packages.billingAddressId],
    references: [address.id],
  }),
  shippingAddress: one(address, {
    fields: [packages.shippingAddressId],
    references: [address.id],
  }),
  deliveryZone: one(deliveryZone, {
    fields: [packages.deliveryZoneId],
    references: [deliveryZone.id],
  }),
  deliveryOption: one(deliveryOption, {
    fields: [packages.deliveryOptionId],
    references: [deliveryOption.id],
  }),
  lineItems: many(packageItem),
}));

// Package Item Relations
export const packageItemRelations = relations(packageItem, ({ one }) => ({
  package: one(packages, {
    fields: [packageItem.packageId],
    references: [packages.id],
  }),
  cargoItem: one(cargoItem, {
    fields: [packageItem.cargoItemId],
    references: [cargoItem.id],
  }),
}));

// Package Selection Model
export type IPackage = InferSelectModel<typeof packages>;

// Package Item Selection Model
export type IPackageItem = InferSelectModel<typeof packageItem>;

// Package Insertion Model
export type InsertPackage = InferInsertModel<typeof packages>;

// Package Item Insertion Model
export type InsertPackageItem = InferInsertModel<typeof packageItem>;
