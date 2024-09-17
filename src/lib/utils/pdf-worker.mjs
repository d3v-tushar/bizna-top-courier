import { parentPort, workerData } from 'worker_threads';
import puppeteer from 'puppeteer';

let browser;

async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

async function generatePDF(html) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px',
    },
    printBackground: true,
  });
  await page.close();
  return pdf;
}

async function main() {
  try {
    const pdf = await generatePDF(workerData);
    parentPort.postMessage(pdf);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
    process.exit(0);
  }
}

main();
