export function pdfTemplate1(data: any) {
  return `
  <html>
  <head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/barcodes/JsBarcode.code128.min.js"></script>
  </head>
  <body>
    <!-- Card -->
    <section class="p-8">
      <div class="flex flex-col bg-white">
        <!-- Grid -->
        <div class="flex justify-between">
          <div>
            <h1 class="mt-2 text-lg font-semibold text-blue-600 md:text-xl dark:text-white">BiznaTop</h1>
          </div>
          <!-- Col -->

          <div class="text-end">
            <svg id="barcode" class="w-48"></svg>
            <h2 class="text-2xl font-semibold text-gray-800 md:text-3xl dark:text-neutral-200">Invoice #${data.id}</h2>
            <span class="mt-1 block text-gray-500 dark:text-neutral-500">${data.barcode}</span>

            <address class="mt-4 not-italic text-gray-800 dark:text-neutral-200">
              ${data.billingAddress.addressLine1}<br />
              ${data.billingAddress.city}, ${data.billingAddress.state}<br />
              ${data.billingAddress.postalCode}, ${data.billingAddress.country}<br />
            </address>
          </div>
          <!-- Col -->
        </div>
        <!-- End Grid -->

        <!-- Grid -->
        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">Bill to:</h3>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">${data.receiver.firstName} ${data.receiver.lastName}</h3>
            <address class="mt-2 not-italic text-gray-500 dark:text-neutral-500">
              ${data.shippingAddress.addressLine1}<br />
              ${data.shippingAddress.city}, ${data.shippingAddress.state}<br />
              ${data.shippingAddress.postalCode}, ${data.shippingAddress.country}<br />
            </address>
          </div>
          <!-- Col -->

          <div class="space-y-2 sm:text-end">
            <!-- Grid -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
              <dl class="grid gap-x-3 sm:grid-cols-5">
                <dt class="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Invoice date:</dt>
                <dd class="col-span-2 text-gray-500 dark:text-neutral-500">${new Date(data.createdAt).toLocaleDateString()}</dd>
              </dl>
            </div>
            <!-- End Grid -->
          </div>
          <!-- Col -->
        </div>
        <!-- End Grid -->

        <!-- Table -->
        <div class="mt-6">
          <div class="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
            <div class="hidden sm:grid sm:grid-cols-5">
              <div class="text-xs font-medium uppercase text-gray-500 sm:col-span-2 dark:text-neutral-500">Item</div>
              <div class="text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">Qty</div>
              <div class="text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">Rate</div>
              <div class="text-end text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">Amount</div>
            </div>

            <div class="hidden border-b border-gray-200 sm:block dark:border-neutral-700"></div>

            ${data.lineItems
              .map(
                (item: any) => `
            <div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
              <div class="col-span-full sm:col-span-2">
                <p class="font-medium text-gray-800 dark:text-neutral-200"># ${item.cargoItem.name}</p>
              </div>
              <div>
                <p class="text-gray-800 dark:text-neutral-200">${item.quantity}</p>
              </div>
              <div>
                <p class="text-gray-800 dark:text-neutral-200">${item.unitPrice}</p>
              </div>
              <div>
                <p class="text-gray-800 sm:text-end dark:text-neutral-200">$${(
                  parseFloat(item.unitPrice) * item.quantity
                ).toFixed(2)}</p>
              </div>
            </div>
            <div class="border-b border-gray-200 sm:hidden dark:border-neutral-700"></div>`,
              )
              .join('')}

          </div>
        </div>
        <!-- End Table -->

        <!-- Flex -->
        <div class="mt-8 flex sm:justify-end">
          <div class="w-full max-w-2xl space-y-2 sm:text-end">
            <!-- Grid -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
              <dl class="grid gap-x-3 sm:grid-cols-5">
                <dt class="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Subtotal:</dt>
                <dd class="col-span-2 text-gray-500 dark:text-neutral-500">$${data.lineItems
                  .reduce(
                    (sum: any, item: any) =>
                      sum + parseFloat(item.unitPrice) * item.quantity,
                    0,
                  )
                  .toFixed(2)}</dd>
              </dl>

              <dl class="grid gap-x-3 sm:grid-cols-5">
                <dt class="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Discount:</dt>
                <dd class="col-span-2 text-gray-500 dark:text-neutral-500">$${data.discountAmount || '0.00'}</dd>
              </dl>

              <dl class="grid gap-x-3 sm:grid-cols-5">
                <dt class="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Total:</dt>
                <dd class="col-span-2 text-gray-500 dark:text-neutral-500">$${data.totalAmount}</dd>
              </dl>

              <dl class="grid gap-x-3 sm:grid-cols-5">
                <dt class="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due balance:</dt>
                <dd class="col-span-2 text-gray-500 dark:text-neutral-500">$0.00</dd>
              </dl>
            </div>
            <!-- End Grid -->
          </div>
        </div>
        <!-- End Flex -->

        <div class="mt-8 sm:mt-12">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">Thank you!</h4>
          <p class="text-gray-500 dark:text-neutral-500">If you have any questions concerning this invoice, use the following contact information:</p>
          <div class="mt-2">
            <p class="block text-sm font-medium text-gray-800 dark:text-neutral-200">support@biznatop.com</p>
            <p class="block text-sm font-medium text-gray-800 dark:text-neutral-200">+39 320 288 3707</p>
          </div>
        </div>

        <p class="mt-5 text-sm text-gray-500 dark:text-neutral-500">© 2024 Biznatop.</p>
      </div>
    </section>
    <!-- End Card -->
  </body>
  <script>
  JsBarcode("#barcode", "${data.barcode}", {
    format: "CODE128",
    lineColor: "#000",
     height: 50,
      displayValue: false,
      width: 2
  });
  </script>
</html>
`;
}
