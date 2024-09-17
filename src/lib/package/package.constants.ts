export const PACKAGE_STATUS = [
  'in progress',
  'dispatched',
  'on air',
  'deliverd',
] as const;

export const PACKAGE_LABEL = [
  'Received At Hub',
  'Dispatch For Main Store, Italy',
  'Received at Main Store, Italy',
  'Dispatch for Bangladesh (On Air)',
  'Received at Main Store, Dhaka',
  'Dispatch for Destination',
  'Delivered',
] as const;

export const PAYMENT_METHOD = ['CARD', 'BANK', 'CASH'] as const;
