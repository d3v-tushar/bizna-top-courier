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
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 500,
    color: '#4b5563',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 10,
  },
  address: {
    fontSize: 10,
    textAlign: 'right',
  },
  billTo: {
    marginTop: 30,
    marginBottom: 30,
  },
  billToTitle: {
    fontSize: 12,
    fontWeight: 500,
  },
  billToContent: {
    fontSize: 10,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 10,
    marginBottom: 20,
  },
  dateLabel: {
    width: 80,
  },
  tableContainer: {
    border: '1 solid #e5e7eb',
    borderRadius: 5,
    padding: 5,
  },
  table: {
    // display: 'flex',
    // width: 'auto',
    // borderStyle: 'solid',
    // borderColor: '#BFDBFE',
    // borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    // borderStyle: 'solid',
    // borderColor: '#BFDBFE',
    // borderBottomColor: '#000',
    // borderWidth: 1,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableColHeaderItem: {
    textAlign: 'left',
    width: '40%',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableColHeaderQty: {
    textAlign: 'right',
    width: '20%',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableColHeaderPrice: {
    textAlign: 'right',
    width: '20%',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableColHeaderTotal: {
    textAlign: 'right',
    width: '20%',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableCol: {
    width: '25%',
    // borderStyle: 'solid',
    // borderColor: '#BFDBFE',
    // borderWidth: 1,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
  },
  tableColItem: {
    textAlign: 'left',
    width: '40%',
  },
  tableColQty: {
    textAlign: 'right',
    width: '20%',
  },
  tableColRate: {
    textAlign: 'right',
    width: '20%',
  },
  tableColAmount: {
    width: '20%',
    textAlign: 'right',
  },
  tableCellHeader: {
    // margin: 'auto',
    margin: 5,
    fontSize: 10,
    fontWeight: 500,
  },
  tableCell: {
    // margin: 'auto',
    margin: 5,
    fontSize: 10,
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
    marginTop: 5,
    fontSize: 10,
  },
  totalsLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 5,
    fontWeight: 500,
  },
  totalsValue: {
    width: 100,
    textAlign: 'right',
  },
  footer: {
    // position: 'absolute',
    // bottom: 30,
    // left: 30,
    // right: 30,
    marginTop: 'auto',
    fontSize: 10,
    textAlign: 'left',
    color: '#666',
  },
});

// Create Document Component
function InvoiceDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>BiznaTop</Text>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <Image
              style={{
                width: 140,
                height: 35,
                marginBottom: 5,
              }}
              src="/api/v1/barcode"
              //@ts-ignore
              alt="barcode"
            />
            <View>
              <Text style={{ ...styles.invoiceTitle }}>Invoice #</Text>
              <Text style={{ ...styles.invoiceNumber, textAlign: 'right' }}>
                BT6H8H98UT3GT
              </Text>
              <Text style={styles.billToContent}>45 Roker Terrace</Text>
              <Text style={styles.billToContent}>Latheronwheel</Text>
              <Text style={styles.billToContent}>KW5 8NW, London</Text>
              <Text style={styles.billToContent}>United Kingdom</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 20,
          }}
        >
          <View style={styles.billTo}>
            <Text style={styles.billToTitle}>Bill to:</Text>
            <Text style={styles.billToContent}>Sara Williams</Text>
            <Text style={styles.billToContent}>280 Suzanne Throughway,</Text>
            <Text style={styles.billToContent}>Breannabury, OR 45801,</Text>
            <Text style={styles.billToContent}>United States</Text>
          </View>

          <View>
            {/* <Text style={styles.invoiceTitle}>Invoice #</Text>
            <Text style={styles.invoiceNumber}>BT6H8H98UT3GT</Text>
            <Text style={styles.billToContent}>45 Roker Terrace</Text>
            <Text style={styles.billToContent}>Latheronwheel</Text>
            <Text style={styles.billToContent}>KW5 8NW, London</Text>
            <Text style={styles.billToContent}>United Kingdom</Text> */}
            <View style={{ ...styles.dates, marginTop: 20 }}>
              <Text style={styles.dateLabel}>Invoice date:</Text>
              <Text>03/10/2018</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeaderItem}>
                <Text style={styles.tableCellHeader}>ITEM</Text>
              </View>
              <View style={styles.tableColHeaderQty}>
                <Text style={styles.tableCellHeader}>QTY</Text>
              </View>
              <View style={styles.tableColHeaderPrice}>
                <Text style={styles.tableCellHeader}>RATE</Text>
              </View>
              <View style={styles.tableColHeaderTotal}>
                <Text style={styles.tableCellHeader}>AMOUNT</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColItem}>
                <Text style={styles.tableCell}>Design UX and UI</Text>
              </View>
              <View style={styles.tableColQty}>
                <Text style={styles.tableCell}>1</Text>
              </View>
              <View style={styles.tableColRate}>
                <Text style={styles.tableCell}>5</Text>
              </View>
              <View style={styles.tableColAmount}>
                <Text style={styles.tableCell}>$500</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColItem}>
                <Text style={styles.tableCell}>Web project</Text>
              </View>
              <View style={styles.tableColQty}>
                <Text style={styles.tableCell}>1</Text>
              </View>
              <View style={styles.tableColRate}>
                <Text style={styles.tableCell}>24</Text>
              </View>
              <View style={styles.tableColAmount}>
                <Text style={styles.tableCell}>$1250</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColItem}>
                <Text style={styles.tableCell}>SEO</Text>
              </View>
              <View style={styles.tableColQty}>
                <Text style={styles.tableCell}>1</Text>
              </View>
              <View style={styles.tableColRate}>
                <Text style={styles.tableCell}>6</Text>
              </View>
              <View style={styles.tableColAmount}>
                <Text style={styles.tableCell}>$2000</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.totals}>
          <Text style={styles.totalsLabel}>Subtotal:</Text>
          <Text style={styles.totalsValue}>$2750.00</Text>
        </View>
        <View style={styles.totals}>
          <Text style={styles.totalsLabel}>Discount:</Text>
          <Text style={styles.totalsValue}>$39.00</Text>
        </View>
        <View style={styles.totals}>
          <Text style={styles.totalsLabel}>Shipping:</Text>
          <Text style={styles.totalsValue}>$0.00</Text>
        </View>
        <View style={styles.totals}>
          <Text style={styles.totalsLabel}>Total Anount:</Text>
          <Text style={styles.totalsValue}>$2789.00</Text>
        </View>

        <View style={styles.footer}>
          <Text style={{ fontSize: 12 }}>Thank you!</Text>
          <Text>
            If you have any questions concerning this invoice, use the following
            contact information:
          </Text>
          <Text>example@site.com</Text>
          <Text>+1 (062) 109-9222</Text>
          <Text>© 2022 Preline.</Text>
        </View>
      </Page>
    </Document>
  );
}

// Wrap the document in a viewer for display
export default function Component() {
  return (
    <PDFViewer width="100%" height={800}>
      <InvoiceDocument />
    </PDFViewer>
  );
}
