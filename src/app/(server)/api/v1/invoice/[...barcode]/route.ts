import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { pdfTemplate1 } from '@/components/templates/invoice/pdf-template-1';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// export async function POST(request: Request) {
//   // Todo: get barcode from request

//   const barcode = 'BTO2RBJE4FMS9';

//   const invoiceData = await db.query.packages.findFirst({
//     columns: {
//       id: true,
//       barcode: true,
//       discountAmount: true,
//       totalAmount: true,
//       createdAt: true,
//     },
//     where: (packages, { eq }) => eq(packages.barcode, barcode),
//     with: {
//       sender: true,
//       receiver: true,
//       billingAddress: true,
//       shippingAddress: true,
//       lineItems: {
//         with: {
//           cargoItem: true,
//         },
//       },
//     },
//   });

//   const html = pdfTemplate1(invoiceData);

//   console.log('Using remote Chromium');
//   const browser = await puppeteer.launch({
//     args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(
//       'https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar',
//     ),
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });

//   if (!browser) {
//     throw new Error('Failed to launch browser');
//   }

//   const page = await browser.newPage();
//   console.log('Page opened'); // Debugging log

//   // Set the HTML content of the page
//   await page.setContent(html, {
//     // * "waitUntil" prop makes fonts work in templates
//     waitUntil: 'networkidle0',
//   });
//   console.log('Page content set'); // Debugging log

//   // Generate the PDF
//   const pdf = await page.pdf({
//     format: 'A4',
//     margin: {
//       top: '10px',
//       right: '10px',
//       bottom: '10px',
//       left: '10px',
//     },
//     printBackground: true,
//   });
//   console.log('PDF generated'); // Debugging log

//   for (const page of await browser.pages()) {
//     await page.close();
//   }

//   // Close the Puppeteer browser
//   await browser.close();
//   console.log('Browser closed'); // Debugging log

//   // Create a Blob from the PDF data
//   const pdfBlob = new Blob([pdf], { type: 'application/pdf' });

//   const response = new NextResponse(pdfBlob, {
//     headers: {
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'inline; filename=invoice.pdf',
//     },
//     status: 200,
//   });

//   return response;
// }

// async function getInvoiceData(barcode: string) {
//   return await db.query.packages.findFirst({
//     columns: {
//       id: true,
//       barcode: true,
//       discountAmount: true,
//       totalAmount: true,
//       createdAt: true,
//     },
//     where: (packages, { eq }) => eq(packages.id, 1),
//     with: {
//       sender: true,
//       receiver: true,
//       billingAddress: true,
//       shippingAddress: true,
//       lineItems: {
//         with: {
//           cargoItem: true,
//         },
//       },
//     },
//   });
// }

// async function generatePDF(html: string) {
//   console.log('Using remote Chromium');
//   const browser = await puppeteer.launch({
//     args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(
//       'https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar',
//     ),
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });

//   try {
//     const page = await browser.newPage();
//     console.log('Page opened');

//     await page.setContent(html, { waitUntil: 'networkidle0' });
//     console.log('Page content set');

//     const pdf = await page.pdf({
//       format: 'A4',
//       margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
//       printBackground: true,
//     });
//     console.log('PDF generated');

//     return pdf;
//   } finally {
//     for (const page of await browser.pages()) {
//       await page.close();
//     }
//     await browser.close();
//     console.log('Browser closed');
//   }
// }

async function getBrowser() {
  const executablePath = await chromium.executablePath();
  return await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });
}

// async function generatePDF(html: string) {
//   console.log('Launching browser');
//   let browser;
//   try {
//     // const executablePath = await chromium.executablePath(
//     //   'https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar',
//     // );

//     browser = await puppeteer.launch({
//       args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath(),
//       headless: chromium.headless,
//       ignoreHTTPSErrors: true,
//     });
//   } catch (error) {
//     console.error('Error launching browser with remote Chromium:', error);
//     console.log('Falling back to local Chrome installation');
//     browser = await puppeteer.launch({
//       args: ['--hide-scrollbars', '--disable-web-security'],
//       executablePath: await chromium.executablePath(), // Replace with the path to your local Chrome installation
//       headless: true,
//       ignoreHTTPSErrors: true,
//     });
//   }

//   if (!browser) {
//     throw new Error('Failed to launch browser');
//   }

//   try {
//     const page = await browser.newPage();
//     console.log('Page opened');

//     await page.setContent(html, { waitUntil: 'networkidle0' });
//     console.log('Page content set');

//     const pdf = await page.pdf({
//       format: 'A4',
//       margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
//       printBackground: true,
//     });
//     console.log('PDF generated');

//     return pdf;
//   } finally {
//     for (const page of await browser.pages()) {
//       await page.close();
//     }
//     await browser.close();
//     console.log('Browser closed');
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const invoiceData = await request.json();

//     if (!invoiceData) {
//       return NextResponse.json(
//         { error: 'Invoice data is required' },
//         { status: 400 },
//       );
//     }

//     const html = pdfTemplate1(invoiceData);
//     const browser = await getBrowser();

//     if (!browser) {
//       throw new Error('Failed to launch browser');
//     }

//     const page = await browser.newPage();
//     console.log('Page opened');

//     await page.setContent(html, { waitUntil: 'networkidle0' });
//     console.log('Page content set');

//     const pdf = await page.pdf({
//       format: 'A4',
//       margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
//       printBackground: true,
//     });
//     console.log('PDF generated');

//     const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
//     const filename = `invoice-${new Date().toISOString()}.pdf`;

//     return new NextResponse(pdfBlob, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename="${filename}"`,
//       },
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error generating invoice:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while generating the invoice' },
//       { status: 500 },
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();
    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Invoice data is required' },
        { status: 400 },
      );
    }
    const html = pdfTemplate1(invoiceData);
    const browser = await getBrowser();
    if (!browser) {
      throw new Error('Failed to launch browser');
    }
    const page = await browser.newPage();
    console.log('Page opened');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('Page content set');
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
      printBackground: true,
    });
    console.log('PDF generated');
    const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
    const filename = `invoice-${new Date().toISOString()}.pdf`;
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the invoice' },
      { status: 500 },
    );
  }
}
