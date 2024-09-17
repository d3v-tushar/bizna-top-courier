'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
interface BarcodeProps {
  barcode: string;
}

export default function InvoiceBarcode({ barcode }: BarcodeProps) {
  const barcodeRef = useRef(null);
  useEffect(() => {
    JsBarcode(barcodeRef.current, barcode, {
      format: 'CODE128',
      height: 50,
      displayValue: false,
      width: 2,
    });
  }, [barcode]);

  return <svg ref={barcodeRef} className="w-48" />;
}
