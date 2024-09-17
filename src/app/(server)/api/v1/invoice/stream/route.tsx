import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import Invoice from '@/components/invoice/invoice-template';
import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get('code');

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 },
      );
    }

    const invData = await db.query.packages.findFirst({
      columns: {
        barcode: true,
        discountAmount: true,
        totalAmount: true,
        createdAt: true,
      },
      with: {
        billingAddress: {
          columns: {
            addressLine1: true,
            addressLine2: true,
            union: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
        shippingAddress: {
          columns: {
            addressLine1: true,
            addressLine2: true,
            union: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
        lineItems: {
          with: {
            cargoItem: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      where: (pkg, { eq }) => eq(pkg.barcode, barcode),
    });

    if (!invData) {
      throw new Error('Invoice not found');
    }

    // Create a canvas with a specified width and height
    const canvas = createCanvas(500, 200);
    const context = canvas.getContext('2d');

    // Generate the barcode on the canvas
    JsBarcode(canvas, barcode, {
      format: 'CODE128', // You can specify the format of the barcode here
      width: 5,
      height: 100,
      displayValue: false, // Whether to display the text value under the barcode
    });

    // Convert the canvas to a PNG buffer
    const barcodeBuffer = canvas.toBuffer('image/png');

    const buffer = await renderToBuffer(
      <Invoice data={invData} barcode={barcodeBuffer} />,
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // 'Content-Disposition': 'attachment; filename=invoice.pdf',
        'Content-Disposition': `attachment; filename=${barcode}_invoice.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate invoice' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
