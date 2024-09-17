import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import { CHROMIUM_EXECUTABLE_PATH, TAILWIND_CDN } from '@/lib/variables';
import { pdfTemplate1 } from '@/components/templates/invoice/pdf-template-1';
import { generatePDF } from '@/lib/utils/generate-pdf';
import db from '@/lib/database';

async function getInvoiceData(barcode: string) {
  return await db.query.packages.findFirst({
    columns: {
      id: true,
      barcode: true,
      discountAmount: true,
      totalAmount: true,
      createdAt: true,
    },
    where: (packages, { eq }) => eq(packages.id, 1),
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
}

export async function POST(request: NextRequest) {
  const invoiceData = await getInvoiceData('1234567890');
  // Create a browser instance
  let browser;
  const html = pdfTemplate1(invoiceData);

  if (process.env.NODE_ENV === 'development') {
    console.log('Prod Environment');
    const puppeteer = await import('puppeteer-core');
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(CHROMIUM_EXECUTABLE_PATH),
      headless: true,
      ignoreHTTPSErrors: true,
    });
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Dev Environment');
    console.log('env', process.env.NODE_ENV);
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }

  if (!browser) {
    throw new Error('Failed to launch browser');
  }

  const page = await browser.newPage();
  console.log('Page opened'); // Debugging log

  // Set the HTML content of the page
  await page.setContent(html, {
    // * "waitUntil" prop makes fonts work in templates
    waitUntil: 'networkidle0',
  });
  console.log('Page content set'); // Debugging log

  //   // Add Tailwind CSS
  //   await page.addStyleTag({
  //     url: TAILWIND_CDN,
  //   });
  //   console.log('Style tag added'); // Debugging log

  // Generate the PDF
  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: '10px',
      right: '10px',
      bottom: '10px',
      left: '10px',
    },
    printBackground: true,
  });
  console.log('PDF generated'); // Debugging log

  for (const page of await browser.pages()) {
    await page.close();
  }

  // Close the Puppeteer browser
  await browser.close();
  console.log('Browser closed'); // Debugging log

  // Create a Blob from the PDF data
  const pdfBlob = new Blob([pdf], { type: 'application/pdf' });

  const response = new NextResponse(pdfBlob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=invoice.pdf',
    },
    status: 200,
  });

  return response;
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  // const { buffer, filename } = await downloadInvoice(formData);
  // const { buffer, filename } = await generateInvoice(formData);

  const html = pdfTemplate1({
    invoiceNumber: 'INV-1001',
    date: '2024-07-15',
    dueDate: '2024-08-15',
    customer: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
    },
    items: [
      {
        name: 'Deocuments',
        description: 'High-quality Documents',
        quantity: 10,
        unit: 'pcs',
        price: 9.99,
      },
      {
        name: 'Toys',
        description: 'Standard Toys',
        quantity: 5,
        unit: 'pcs',
        price: 7.99,
      },
    ],
    subtotal: 149.85,
    total: 162.84,
    tax: 12.99,
    amountPaid: 100.0,
    dueBalance: 62.84,
    additionalInfo: {
      email: 'john.doe@example.com',
      phone: '555-1234',
    },
  });

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
