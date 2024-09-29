'use client';
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';

// Register custom fonts
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
  ],
});

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     padding: 30,
//     fontFamily: 'Roboto',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   logo: {
//     width: 50,
//     height: 50,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: 500,
//     color: '#4b5563',
//   },
//   invoiceTitle: {
//     fontSize: 24,
//     fontWeight: 500,
//     textAlign: 'right',
//   },
//   invoiceNumber: {
//     fontSize: 12,
//     textAlign: 'right',
//     marginBottom: 10,
//   },
//   address: {
//     fontSize: 10,
//     textAlign: 'right',
//   },
//   billTo: {
//     marginTop: 30,
//     marginBottom: 30,
//   },
//   billToTitle: {
//     fontSize: 12,
//     fontWeight: 500,
//   },
//   billToContent: {
//     fontSize: 10,
//   },
//   dates: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     fontSize: 10,
//     marginBottom: 20,
//   },
//   dateLabel: {
//     width: 80,
//   },
//   tableContainer: {
//     border: '1 solid #e5e7eb',
//     borderRadius: 5,
//     padding: 5,
//   },
//   table: {
//     // display: 'flex',
//     // width: 'auto',
//     // borderStyle: 'solid',
//     // borderColor: '#BFDBFE',
//     // borderWidth: 1,
//     // borderRightWidth: 0,
//     // borderBottomWidth: 0,
//   },
//   tableRow: {
//     margin: 'auto',
//     flexDirection: 'row',
//   },
//   tableColHeader: {
//     width: '25%',
//     // borderStyle: 'solid',
//     // borderColor: '#BFDBFE',
//     // borderBottomColor: '#000',
//     // borderWidth: 1,
//     // borderLeftWidth: 0,
//     // borderTopWidth: 0,
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   tableColHeaderItem: {
//     textAlign: 'left',
//     width: '40%',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   tableColHeaderQty: {
//     textAlign: 'right',
//     width: '20%',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   tableColHeaderPrice: {
//     textAlign: 'right',
//     width: '20%',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   tableColHeaderTotal: {
//     textAlign: 'right',
//     width: '20%',
//     borderBottomWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   tableCol: {
//     width: '25%',
//     // borderStyle: 'solid',
//     // borderColor: '#BFDBFE',
//     // borderWidth: 1,
//     // borderLeftWidth: 0,
//     // borderTopWidth: 0,
//   },
//   tableColItem: {
//     textAlign: 'left',
//     width: '40%',
//   },
//   tableColQty: {
//     textAlign: 'right',
//     width: '20%',
//   },
//   tableColRate: {
//     textAlign: 'right',
//     width: '20%',
//   },
//   tableColAmount: {
//     width: '20%',
//     textAlign: 'right',
//   },
//   tableCellHeader: {
//     // margin: 'auto',
//     margin: 5,
//     fontSize: 10,
//     fontWeight: 500,
//   },
//   tableCell: {
//     // margin: 'auto',
//     margin: 5,
//     fontSize: 10,
//   },
//   totals: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginRight: 10,
//     marginTop: 5,
//     fontSize: 10,
//   },
//   totalsLabel: {
//     width: 100,
//     textAlign: 'right',
//     marginRight: 5,
//     fontWeight: 500,
//   },
//   totalsValue: {
//     width: 100,
//     textAlign: 'right',
//   },
//   footer: {
//     // position: 'absolute',
//     // bottom: 30,
//     // left: 30,
//     // right: 30,
//     marginTop: 'auto',
//     fontSize: 10,
//     textAlign: 'left',
//     color: '#666',
//   },
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 0,
    paddingTop: 10,
    flexGrow: 1,
  },
  sectionT: {
    margin: 0,
    paddingTop: 0,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
  },
  boldName: {
    fontSize: 14,
    marginBottom: 5,
  },
  headerColA: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'flex-start',
    padding: 5,
    fontSize: 8,
    border: 2,
    fontWeight: 'bold',
    borderColor: 'green',
  },

  headerColB: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'center',
    padding: 5,
    fontSize: 8,
    border: 0,
    marginRight: 0,
    marginLeft: 'auto',
  },
  headerS: {
    flexDirection: 'row',
    border: 2,
    padding: 2,
  },
  headerSi: {
    flexDirection: 'row',
    border: 0,
    padding: 0,
  },
  headerColC: {
    flexDirection: 'column',
    width: '50%',
    justifyContent: 'center',
    padding: 5,
    fontSize: 10,
    border: 0,
    marginRight: 0,
    marginLeft: 'auto',
  },

  headerColD: {
    flexDirection: 'column',
    width: '50%',
    justifyContent: 'center',
    padding: 5,
    fontSize: 10,
    border: 0,
    marginRight: 0,
    marginLeft: 'auto',
  },
  headerColE: {
    flexDirection: 'column',
    width: '85%',
    justifyContent: 'center',
    padding: 5,
    fontSize: 10,
    border: 0,

    marginLeft: 0,
  },
  headerColF: {
    flexDirection: 'column',
    width: '15%',
    justifyContent: 'center',
    padding: 5,
    fontSize: 10,
    border: 0,
    marginRight: 0,
    marginLeft: 'auto',
  },
  logo: {
    width: 120,
    height: 80,
    marginLeft: 0,
  },
  barCode: {
    width: '100%',
    height: 50,
    marginLeft: 0,
  },
  qrCode: {
    width: 75,
    height: 75,
    marginRight: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  trId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  productDes: {
    fontSize: 8,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
    marginTop: 10,
    border: 1,
  },

  lineC: {
    height: 1,
    backgroundColor: '#013',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    border: 0,
  },

  lineItemsContainer: {
    marginTop: 0,
  },
  lineItemsTable: {
    // border: '1 solid #e5e7eb',
    border: '2 solid #000',
    // borderRadius: 4,
    // padding: 4,
  },
  lineItemsTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    // borderBottomColor: '#e5e7eb',
    borderBottomColor: '#000',
    // paddingBottom: 8,
    // marginBottom: 8,
    padding: 5,
  },
  lineItemsTableHeaderCell: {
    fontSize: 10,
    fontWeight: 'medium',
    // color: '#6b7280',
    color: '#000',
    textTransform: 'uppercase',
  },
  lineItemsTableRow: {
    flexDirection: 'row',
    // marginBottom: 8,
    padding: 5,
  },
  lineItemsTableCell: {
    fontSize: 10,
    color: '#1f2937',
  },
  itemCell: {
    flex: 2,
  },
  qtyCell: {
    flex: 1,
    textAlign: 'left',
  },
  rateCell: {
    flex: 1,
    textAlign: 'left',
  },
  amountCell: {
    flex: 1,
    textAlign: 'right',
  },
});

type Package = {
  id: number;
  barcode: string;
  note: string;
  createdAt: Date;
  discountAmount: string | null;
  totalAmount: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'SENDER' | 'RECEIVER';
  };
  receiver: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'SENDER' | 'RECEIVER';
  };
  billingAddress: {
    addressLine1: string;
    addressLine2: string | null;
    union: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2: string | null;
    union: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  lineItems: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    packageId: number;
    cargoItemId: number;
    unitPrice: string;
    quantity: number;
    cargoItem: {
      name: string;
    };
  }[];
};

// Create Document Component
function InvoiceDocument({ data }: { data: Package }) {
  const subTotal = data.lineItems
    .reduce((sum, item) => sum + parseFloat(item.unitPrice) * item.quantity, 0)
    .toFixed(2);

  const discount = (Number(subTotal) - Number(data.totalAmount)).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerColA}>
            <Image
              style={styles.logo}
              src="https://utfs.io/f/5L9L00rPwNRfh27ysQ96TpbrR7twv19k4jyGSAeMV3gx0fBs"
              //@ts-ignore
              alt="logo"
            />
            <View>
              <Text style={styles.boldName}>BIZNA TOP CARGO</Text>
              <Text style={styles.boldName}>& TRAVELS</Text>
              <Text>ADDRESS : Via delle portelle 20/22, Terni -TR 05100 </Text>
              <Text>PHONE : +39 333 9414394</Text>
              <Text>EMAIL : support@biznatop.com</Text>
            </View>
          </View>
          <View style={styles.headerColB}>
            <View>
              <Image
                style={styles.barCode}
                src="https://utfs.io/f/5L9L00rPwNRfZukWvY7CPGBjAI7zbFwWVY1tT4Hqkgav9oM3"
                //@ts-ignore
                alt="Barcode"
              />
              <Text style={styles.boldName}>INVOICE NO #{data.id}</Text>
              <Text style={styles.trId}>Tracking ID : {data.barcode}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Invoice Details</Text>
          <View style={styles.headerS}>
            <View style={styles.headerColC}>
              <Text>
                Sender Name : {data.sender.firstName} {data.sender.lastName}
              </Text>
              <Text>
                Sender Address : {data.billingAddress.addressLine1},{' '}
                {data.billingAddress.addressLine2} {data.billingAddress.city} -
                {data.billingAddress.state} {data.billingAddress.postalCode}
              </Text>
              <Text>Phone : {data.sender.phone}</Text>
              <Text>Email : {data.sender.email}</Text>
            </View>
            <View style={styles.headerColD}>
              <Text>
                Receiver Name : {data.receiver.firstName}{' '}
                {data.receiver.lastName}
              </Text>
              <Text>
                Receiver Address : {data.shippingAddress.addressLine1},{' '}
                {data.shippingAddress.addressLine2} {data.shippingAddress.city}{' '}
                -{data.shippingAddress.state} {data.shippingAddress.postalCode}
              </Text>
              <Text>Phone : {data.receiver.phone}</Text>
              <Text>Email : {data.receiver.email}</Text>
            </View>
          </View>
          <Text style={styles.productDes}>
            {data.note ? `Package Description : ${data.note}` : ''}
          </Text>
        </View>

        <View style={styles.lineItemsContainer}>
          <View style={styles.lineItemsTable}>
            <View style={styles.lineItemsTableHeader}>
              <Text style={[styles.lineItemsTableHeaderCell, styles.itemCell]}>
                Item
              </Text>
              <Text style={[styles.lineItemsTableHeaderCell, styles.qtyCell]}>
                Qty
              </Text>
              <Text style={[styles.lineItemsTableHeaderCell, styles.rateCell]}>
                Rate
              </Text>
              <Text
                style={[styles.lineItemsTableHeaderCell, styles.amountCell]}
              >
                Amount
              </Text>
            </View>

            {data.lineItems.map((item) => (
              <View key={item.id} style={styles.lineItemsTableRow}>
                <Text style={[styles.lineItemsTableCell, styles.itemCell]}>
                  {item.cargoItem.name}
                </Text>
                <Text style={[styles.lineItemsTableCell, styles.qtyCell]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.lineItemsTableCell, styles.rateCell]}>
                  €{item.unitPrice}
                </Text>
                <Text style={[styles.lineItemsTableCell, styles.amountCell]}>
                  €{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            fontSize: 10,
            paddingRight: 6,
            marginTop: 5,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <Text>Subtotal:</Text>
            <Text>€{subTotal}</Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <Text>Discount:</Text>
            <Text>€{discount}</Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <Text>Total:</Text>
            <Text>€{data.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <View style={styles.headerS}>
            <View style={styles.headerColE}>
              <Text>
                BIZNA TOP will make every reasonable effort to deliver the
                Shipment according to BIZNA TOP’s regular delivery schedules,
                but these schedules are not binding and do not form part of the
                contract. BIZNA TOP is not liable for any damages or loss caused
                by delay.
              </Text>

              <Text>
                & scan the QR code to read the full terms and conditions.
              </Text>
            </View>
            <View style={styles.headerColF}>
              <Image
                style={styles.qrCode}
                src="https://utfs.io/f/5L9L00rPwNRfgvRohVv2nJtSRLVhNeK56kvGqIacd2DiMWxU"
                //@ts-ignore
                alt="QR Code"
              />
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <View style={styles.section}>
            <Text style={styles.title}>
              Hereby,I declare that I will agree to all the terms and conditions
            </Text>
            <View style={styles.headerSi}>
              <View style={styles.headerColC}>
                <Text>Sendes Signature</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.headerColD}>
                <Text>Agents Signature</Text>
                <View style={styles.line} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineC} />

        <View style={styles.header}>
          <View style={styles.headerColA}>
            <Image
              style={styles.logo}
              src="https://utfs.io/f/5L9L00rPwNRfh27ysQ96TpbrR7twv19k4jyGSAeMV3gx0fBs"
              //@ts-ignore
              alt="logo"
            />
            <View>
              <Text style={styles.boldName}>BIZNA TOP CARGO</Text>
              <Text style={styles.boldName}>& TRAVELS</Text>
              <Text>ADDRESS : Via delle portelle 20/22, Terni -TR 05100</Text>
              <Text>PHONE : +39 333 9414394</Text>
              <Text>EMAIL : support@biznatop.com</Text>
            </View>
          </View>
          <View style={styles.headerColB}>
            <View>
              <Image
                style={styles.barCode}
                src="https://utfs.io/f/5L9L00rPwNRfZukWvY7CPGBjAI7zbFwWVY1tT4Hqkgav9oM3"
                //@ts-ignore
                alt="barcode"
              />
              <Text style={styles.boldName}>INVOICE NO #{data.id}</Text>
              <Text style={styles.trId}>Tracking ID : {data.barcode}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Invoice Details</Text>
          <View style={styles.headerS}>
            <View style={styles.headerColC}>
              <Text>
                Sender Name : {data.sender.firstName} {data.sender.lastName}
              </Text>
              <Text>
                Sender Address : {data.billingAddress.addressLine1},{' '}
                {data.billingAddress.addressLine2} {data.billingAddress.city} -
                {data.billingAddress.state} {data.billingAddress.postalCode}
              </Text>
              <Text>Phone : {data.sender.phone}</Text>
              <Text>Email : {data.sender.email}</Text>
            </View>
            <View style={styles.headerColD}>
              <Text>
                Receiver Name : {data.receiver.firstName}{' '}
                {data.receiver.lastName}
              </Text>
              <Text>
                Receiver Address : {data.shippingAddress.addressLine1},{' '}
                {data.shippingAddress.addressLine2} {data.shippingAddress.city}{' '}
                -{data.shippingAddress.state} {data.shippingAddress.postalCode}
              </Text>
              <Text>Phone : {data.receiver.phone}</Text>
              <Text>Email : {data.receiver.email}</Text>
            </View>
          </View>
          <Text style={styles.productDes}>
            {data.note ? `Package Description : ${data.note}` : ''}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

const packageData: Package = {
  id: 14,
  barcode: 'BT6ILERKCCEVY',
  note: 'Please handle with care',
  discountAmount: '0.00',
  totalAmount: '427.50',
  createdAt: new Date('2024-09-09T16:40:46.648Z'),
  sender: {
    id: 19,
    firstName: 'Stefano',
    lastName: 'Rei',
    phone: '3455322577',
    email: 'stef@biznatop.com',
    type: 'SENDER',
    createdAt: new Date('2024-09-09T16:40:46.648Z'),
    updatedAt: new Date('2024-09-09T16:40:46.648Z'),
  },
  receiver: {
    id: 20,
    firstName: 'asdasdaw',
    lastName: 'asdasdas',
    phone: '01647899885',
    email: 'asdasdasdasdas@hmail.com',
    type: 'RECEIVER',
    createdAt: new Date('2024-09-09T16:40:46.648Z'),
    updatedAt: new Date('2024-09-09T16:40:46.648Z'),
  },
  billingAddress: {
    addressLine1: 'asdsaaasd aad a da',
    addressLine2: 'asdasdasda asdasd asd',
    union: 'asdasdas  a',
    city: 'asd a',
    state: 'asdad',
    postalCode: '1222',
    country: 'Italy',
  },
  shippingAddress: {
    addressLine1: 'ada  asd asdasasd a',
    addressLine2: 'asd a dasa dasd',
    union: 'asdadasd',
    city: 'asdasdas',
    state: 'asdadas',
    postalCode: 'asdadas',
    country: 'asdasdasdas',
  },
  lineItems: [
    {
      id: 15,
      packageId: 14,
      cargoItemId: 10,
      unitPrice: '25',
      quantity: 10,
      createdAt: new Date('2024-09-09T16:40:46.648Z'),
      updatedAt: new Date('2024-09-09T16:40:46.648Z'),
      cargoItem: {
        name: 'Mobile Android',
      },
    },
    {
      id: 16,
      packageId: 14,
      cargoItemId: 9,
      unitPrice: '45',
      quantity: 5,
      createdAt: new Date('2024-09-09T16:40:46.648Z'),
      updatedAt: new Date('2024-09-09T16:40:46.648Z'),
      cargoItem: {
        name: 'Tv',
      },
    },
  ],
};

// Wrap the document in a viewer for display
export default function Component() {
  return (
    <PDFViewer width="100%" height={800}>
      <InvoiceDocument data={packageData} />
    </PDFViewer>
  );
}
