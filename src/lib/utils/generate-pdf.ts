import { Worker } from 'worker_threads';
import path from 'path';

export async function generatePDF(html: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.resolve(process.cwd(), 'src/lib/utils/pdf-worker.mjs'),
      {
        workerData: html,
      },
    );

    worker.on('message', (pdf: Buffer) => {
      resolve(pdf);
      worker.terminate();
    });

    worker.on('error', (error: Error) => {
      reject(error);
      worker.terminate();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
