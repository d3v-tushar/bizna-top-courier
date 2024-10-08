import React from 'react';
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Svg,
  Path,
  Link,
  Image,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '/src/fonts/Helvetica Regular.otf', fontWeight: 'normal' },
    { src: '/src/fonts/Helvetica-Bold-Font.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     padding: 40,
//     fontFamily: 'Helvetica',
//     position: 'relative',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   flexBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   companyLogo: {
//     width: 40,
//     height: 40,
//   },
//   companyName: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: 'semibold',
//     color: '#2563EB',
//   },
//   invoiceTitle: {
//     fontSize: 24,
//     fontWeight: 'semibold',
//     color: '#1F2937',
//     textAlign: 'right',
//   },
//   invoiceNumber: {
//     marginTop: 4,
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'right',
//   },
//   addressBilling: {
//     marginTop: 16,
//     fontSize: 14,
//     color: '#1F2937',
//     textAlign: 'right',
//   },
//   addressShipping: {
//     marginTop: 16,
//     fontSize: 14,
//     color: '#1F2937',
//     textAlign: 'left',
//   },
//   grid: {
//     marginTop: 32,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   gridCol: {
//     flex: 1,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'semibold',
//     color: '#1F2937',
//   },
//   table: {
//     marginTop: 24,
//     border: '1 solid #E5E7EB',
//     borderRadius: 8,
//     padding: 16,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingBottom: 8,
//   },
//   tableHeaderCell: {
//     flex: 1,
//     fontSize: 12,
//     fontWeight: 'medium',
//     color: '#6B7280',
//     textTransform: 'uppercase',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingVertical: 8,
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 14,
//     color: '#1F2937',
//   },
//   summarySection: {
//     marginTop: 32,
//     alignItems: 'flex-end',
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '50%',
//     marginBottom: 8,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     fontWeight: 'semibold',
//     color: '#1F2937',
//   },
//   summaryValue: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   footer: {
//     marginTop: 32,
//   },
//   footerTitle: {
//     fontSize: 18,
//     fontWeight: 'semibold',
//     color: '#1F2937',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   footerContact: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: 'medium',
//     color: '#1F2937',
//   },
//   copyright: {
//     marginTop: 20,
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   button: {
//     padding: '8 12',
//     borderRadius: 8,
//     fontSize: 14,
//     fontWeight: 'medium',
//     textDecoration: 'none',
//   },
//   buttonOutline: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     color: '#1F2937',
//   },
//   buttonPrimary: {
//     backgroundColor: '#2563EB',
//     color: '#FFFFFF',
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

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     padding: 30,
//     fontFamily: 'Helvetica',
//     position: 'relative',
//   },

//   // Block 1
//   flexBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   leftColumn: {
//     flexDirection: 'column',
//   },
//   rightColumn: {
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//     marginTop: 35,
//   },
//   logo: {
//     width: 26,
//     height: 26,
//   },
//   companyName: {
//     marginTop: 8,
//     fontSize: 20,
//     fontWeight: 800,
//     color: '#4b5563',
//   },
//   invoiceTitle: {
//     fontSize: 24,
//     fontWeight: 'semibold',
//     color: 'black',
//   },
//   invoiceNumber: {
//     marginTop: 4,
//     fontSize: 12,
//     color: 'gray',
//   },
//   addressBilling: {
//     marginTop: 16,
//     fontSize: 12,
//     color: 'black',
//     textAlign: 'left',
//   },

//   // Bloack 2
//   billToContainer: {
//     marginTop: 32,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//   },
//   column: {
//     width: '48%',
//   },
//   heading: {
//     fontSize: 14,
//     fontWeight: 'semibold',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   text: {
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   rightAlign: {
//     textAlign: 'right',
//   },
//   dateGrid: {
//     marginTop: 8,
//   },
//   dateRow: {
//     flexDirection: 'row',
//     gap: 5,
//     // justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   dateLabel: {
//     fontSize: 12,
//     fontWeight: 'semibold',
//     color: '#1f2937',
//   },
//   dateValue: {
//     fontSize: 12,
//     color: '#6b7280',
//   },

//   //Block 3
//   lineItemsContainer: {
//     marginTop: 24,
//   },
//   table: {
//     border: '1 solid #e5e7eb',
//     borderRadius: 4,
//     padding: 16,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     paddingBottom: 8,
//     marginBottom: 8,
//   },
//   tableHeaderCell: {
//     fontSize: 10,
//     fontWeight: 'medium',
//     color: '#6b7280',
//     textTransform: 'uppercase',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   tableCell: {
//     fontSize: 12,
//     color: '#1f2937',
//   },
//   itemCell: {
//     flex: 2,
//   },
//   qtyCell: {
//     flex: 1,
//     textAlign: 'left',
//   },
//   rateCell: {
//     flex: 1,
//     textAlign: 'left',
//   },
//   amountCell: {
//     flex: 1,
//     textAlign: 'right',
//   },

//   //Block 4
//   summaryContainer: {
//     marginTop: 24,
//   },
//   summaryTable: {
//     // border: '1 solid #e5e7eb',
//     // borderRadius: 4,
//     padding: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   col: {
//     flex: 1,
//   },
//   item: {
//     fontSize: 12,
//     color: '#1f2937',
//   },
//   itemLabel: {
//     fontWeight: 'medium',
//   },
//   itemValue: {
//     textAlign: 'right',
//   },
//   divider: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     marginVertical: 8,
//   },

//   //Block 5
//   footerContainer: {
//     marginTop: 8,
//   },
//   footerHeading: {
//     fontSize: 14,
//     fontWeight: 'semibold',
//     color: '#1F2937', // gray-800
//   },
//   paragraph: {
//     fontSize: 12,
//     color: '#6B7280', // gray-500
//     marginTop: 2,
//   },
//   contactInfo: {
//     marginTop: 8,
//     lineHeight: 1.5,
//   },
//   contactText: {
//     fontSize: 12,
//     fontWeight: 'medium',
//     color: '#1F2937', // gray-800
//   },
//   footer: {
//     fontSize: 10,
//     color: '#6B7280', // gray-500
//     marginTop: 20,
//   },
// });

// Company Logo component
// const InvoiceHeader = () => (
//   <View style={styles.flexBetween}>
//     <View style={styles.leftColumn}>
//       <Text style={styles.companyName}>Bizna Top</Text>
//     </View>
//     <View style={styles.rightColumn}>
//       <Text style={styles.invoiceTitle}>Invoice #</Text>
//       <Text style={styles.invoiceNumber}>3682303</Text>
//       <Text style={styles.addressBilling}>
//         45 Roker Terrace{'\n'}
//         Latheronwheel{'\n'}
//         KW5 8NW, London{'\n'}
//         United Kingdom
//       </Text>
//     </View>
//   </View>
// );

// const InvoiceBillingSection = () => (
//   <View style={styles.billToContainer}>
//     <View style={styles.column}>
//       <Text style={styles.heading}>Bill to:</Text>
//       <Text style={styles.heading}>Sara Williams</Text>
//       <Text style={styles.text}>
//         280 Suzanne Throughway,{'\n'}
//         Breannabury, OR 45801,{'\n'}
//         United States
//       </Text>
//     </View>

//     <View style={[styles.column, styles.rightAlign]}>
//       <View style={styles.dateGrid}>
//         <View style={styles.dateRow}>
//           <Text style={styles.dateLabel}>Invoice date:</Text>
//           <Text style={styles.dateValue}>03/10/2018</Text>
//         </View>
//         {/* <View style={styles.dateRow}>
//           <Text style={styles.dateLabel}>Due date:</Text>
//           <Text style={styles.dateValue}>03/11/2018</Text>
//         </View> */}
//       </View>
//     </View>
//   </View>
// );

// const LineItem = ({
//   item,
//   quantity,
//   rate,
//   amount,
// }: {
//   [key: string]: string;
// }) => (
//   <View style={styles.tableRow}>
//     <Text style={[styles.tableCell, styles.itemCell]}>{item}</Text>
//     <Text style={[styles.tableCell, styles.qtyCell]}>{quantity}</Text>
//     <Text style={[styles.tableCell, styles.rateCell]}>{rate}</Text>
//     <Text style={[styles.tableCell, styles.amountCell]}>${amount}</Text>
//   </View>
// );

// const InvoiceLineItems = () => (
//   <View style={styles.lineItemsContainer}>
//     <View style={styles.table}>
//       <View style={styles.tableHeader}>
//         <Text style={[styles.tableHeaderCell, styles.itemCell]}>Item</Text>
//         <Text style={[styles.tableHeaderCell, styles.qtyCell]}>Qty</Text>
//         <Text style={[styles.tableHeaderCell, styles.rateCell]}>Rate</Text>
//         <Text style={[styles.tableHeaderCell, styles.amountCell]}>Amount</Text>
//       </View>

//       <LineItem
//         item="Design UX and UI, Web project is very funny. long story. test title"
//         quantity="1"
//         rate="5"
//         amount="500"
//       />
//       <LineItem item="Web project" quantity="1" rate="24" amount="1250" />
//       <LineItem item="SEO" quantity="1" rate="6" amount="2000" />
//     </View>
//   </View>
// );

// const BillingItem = ({ label, value }: { [key: string]: string }) => (
//   <View style={styles.row}>
//     <View style={styles.col}>
//       <Text style={[styles.item, styles.itemLabel]}>{label}</Text>
//     </View>
//     <View style={styles.col}>
//       <Text style={[styles.item, styles.itemValue]}>€{value}</Text>
//     </View>
//   </View>
// );

// const InvoiceBillingSummary = () => (
//   <View style={styles.summaryContainer}>
//     <View style={styles.summaryTable}>
//       <BillingItem label="Subtotal" value="3750" />
//       <BillingItem label="Discount" value="39.00" />
//       <BillingItem label="Shipping" value="0.00" />
//       <BillingItem label="Total" value="3789.00" />
//       {/* <BillingItem label="Amount paid" value="$3789.00" />
//       <BillingItem label="Due balance" value="$0.00" /> */}
//     </View>
//   </View>
// );

// const InvoiceFooter = () => (
//   <View style={styles.footerContainer}>
//     <Text style={styles.footerHeading}>Thank you!</Text>
//     <Text style={styles.paragraph}>
//       If you have any questions concerning this invoice, use the following
//       contact information:
//     </Text>
//     <View style={styles.contactInfo}>
//       <Text style={styles.contactText}>support@biznatop.com</Text>
//       <Text style={styles.contactText}>+39 320 288 3707</Text>
//     </View>
//     <Text style={styles.footer}>© 2025 Biznatop.</Text>
//   </View>
// );

// Create Document Component
// const Invoice = ({
//   data,
//   barcode,
// }: {
//   data: {
//     items: {
//       name: string;
//       quantity: number;
//       rate: number;
//       amount: number;
//     }[];
//     subtotal: string;
//     total: string;
//     tax: string;
//     amountPaid: string;
//     dueBalance: string;
//   };
//   barcode: Buffer;
// }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Image
//         style={{
//           width: 170,
//           height: 45,
//           position: 'absolute',
//           right: 10,
//           top: 10,
//         }}
//         // src="https://app.biznatop.com/api/v1/barcode"
//         // src={`data:image/png;base64,${barcode.toString('base64')}`}
//         src={barcode}
//         //@ts-ignore
//         alt="Barcode"
//       />
//       <View style={styles.flexBetween}>
//         <View>
//           <Text style={styles.companyName}>BiznaTop</Text>
//         </View>
//         <View>
//           <Text style={styles.invoiceTitle}>Invoice #</Text>
//           <Text style={styles.invoiceNumber}>3682303</Text>
//           <Text style={styles.addressBilling}>
//             45 Roker Terrace{'\n'}
//             Latheronwheel{'\n'}
//             KW5 8NW, London{'\n'}
//             United Kingdom
//           </Text>
//         </View>
//       </View>

//       <View style={styles.grid}>
//         <View style={styles.gridCol}>
//           <Text style={styles.sectionTitle}>Bill to:</Text>
//           <Text style={styles.sectionTitle}>Sara Williams</Text>
//           <Text style={styles.addressShipping}>
//             280 Suzanne Throughway,{'\n'}
//             Breannabury, OR 45801,{'\n'}
//             United States
//           </Text>
//         </View>
//         <View style={[styles.gridCol, { alignItems: 'flex-end' }]}>
//           <View style={styles.flexBetween}>
//             <Text style={styles.summaryLabel}>Invoice date:</Text>
//             <Text style={styles.summaryValue}>03/10/2018</Text>
//           </View>
//           <View style={styles.flexBetween}>
//             <Text style={styles.summaryLabel}>Due date:</Text>
//             <Text style={styles.summaryValue}>03/11/2018</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.table}>
//         <View style={styles.tableHeader}>
//           <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Item</Text>
//           <Text style={styles.tableHeaderCell}>Qty</Text>
//           <Text style={styles.tableHeaderCell}>Rate</Text>
//           <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>
//             Amount
//           </Text>
//         </View>
//         {data.items.map((item, index) => (
//           <View key={index} style={styles.tableRow}>
//             <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
//             <Text style={styles.tableCell}>{item.quantity}</Text>
//             <Text style={styles.tableCell}>{item.rate}</Text>
//             <Text style={[styles.tableCell, { textAlign: 'right' }]}>
//               ${item.amount}
//             </Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.summarySection}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal:</Text>
//           <Text style={styles.summaryValue}>${data.subtotal}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Total:</Text>
//           <Text style={styles.summaryValue}>${data.total}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Tax:</Text>
//           <Text style={styles.summaryValue}>${data.tax}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Amount paid:</Text>
//           <Text style={styles.summaryValue}>${data.amountPaid}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Due balance:</Text>
//           <Text style={styles.summaryValue}>${data.dueBalance}</Text>
//         </View>
//       </View>

//       <View style={styles.footer}>
//         <Text style={styles.footerTitle}>Thank you!</Text>
//         <Text style={styles.footerText}>
//           If you have any questions concerning this invoice, use the following
//           contact information:
//         </Text>
//         <Text style={styles.footerContact}>example@site.com</Text>
//         <Text style={styles.footerContact}>+1 (062) 109-9222</Text>
//       </View>

//       <Text style={styles.copyright}>© 2022 Preline.</Text>
//     </Page>
//   </Document>
// );

type Package = {
  id: number;
  barcode: string;
  note: string | null;
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

function InvoiceDocument({
  data,
  barcode,
}: {
  data: Package;
  barcode: Buffer;
}) {
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
                src={barcode}
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
                src="https://utfs.io/f/5L9L00rPwNRfJ6Z5wqnEm1AtWboSxuwC3g85D0pM7IT9zvV6"
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
                src={barcode}
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
export default InvoiceDocument;
