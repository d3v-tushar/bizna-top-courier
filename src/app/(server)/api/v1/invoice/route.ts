import { pdfTemplate1 } from '@/components/templates/invoice/pdf-template-1';
import db from '@/lib/database';
import { generatePDF } from '@/lib/utils/generate-pdf';

export async function POST(req: Request) {
  const formData = await req.formData();

  const invoiceData = await db.query.packages.findFirst({
    columns: {
      id: true,
      barcode: true,
      discountAmount: true,
      totalAmount: true,
      createdAt: true,
    },
    where: (packages, { eq }) =>
      eq(packages.id, Number(formData.get('packageId'))),
    with: {
      sender: true,
      receiver: true,
      billingAddress: true,
      shippingAddress: true,
      lineItems: {
        with: {
          cargoItem: true,
        },
      },
    },
  });

  const html = pdfTemplate1(invoiceData);

  try {
    const pdfBuffer = await generatePDF(html);
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return new Response('PDF generation failed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
