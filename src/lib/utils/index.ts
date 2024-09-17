import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Code 128 uses all 128 ASCII characters, but we'll use a subset for simplicity
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BARCODE_LENGTH = 10; // Adjust this as needed
const PREFIX = 'BT';

const generateUniqueId = customAlphabet(ALPHABET, BARCODE_LENGTH);

function calculateChecksum(data: string) {
  let sum = 104; // Start character B
  for (let i = 0; i < data.length; i++) {
    sum += (ALPHABET.indexOf(data[i]) + 32) * (i + 1);
  }
  return sum % 103;
}

export function generateBarcode() {
  const uniqueId = generateUniqueId();
  const data = PREFIX + uniqueId;
  const checksum = calculateChecksum(data);
  return data + ALPHABET[checksum % ALPHABET.length];
}
