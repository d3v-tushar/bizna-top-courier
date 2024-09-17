import { InferSelectModel } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';

// User Role enum
export const userRole = pgEnum('user_role', ['ADMIN', 'AGENT', 'CLIENT']);

// Package Status enum
export const packageStatus = pgEnum('package_status', [
  'in progress',
  'dispatched',
  'on air',
  'deliverd',
]);

// Package Label enum
export const packagelabel = pgEnum('package_label', [
  'Received At Hub',
  'Dispatch For Main Store, Italy',
  'Received at Main Store, Italy',
  'Dispatch for Bangladesh (On Air)',
  'Received at Main Store, Dhaka',
  'Dispatch for Destination',
  'Delivered',
]);

//Payment Method enum
export const paymentMethod = pgEnum('payment_method', ['CARD', 'BANK', 'CASH']);

// Party Type enum
export const partyType = pgEnum('party_type', ['SENDER', 'RECEIVER']);
