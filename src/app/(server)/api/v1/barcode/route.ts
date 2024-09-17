import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

export async function GET(request: Request) {
  // Create a canvas with a specified width and height
  const canvas = createCanvas(500, 200);
  const context = canvas.getContext('2d');

  // Generate the barcode on the canvas
  JsBarcode(canvas, '123456789', {
    format: 'CODE128', // You can specify the format of the barcode here
    width: 5,
    height: 100,
    displayValue: false, // Whether to display the text value under the barcode
  });

  // Convert the canvas to a PNG buffer
  const buffer = canvas.toBuffer('image/png');

  // Return the image as a response
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length.toString(),
    },
  });
}
