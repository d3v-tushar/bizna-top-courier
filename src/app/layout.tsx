import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from 'sonner';

// const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const poppins = Poppins({
  subsets: ['latin'], // Specify the character subset
  weight: ['400', '500', '600', '700'], // Specify the weights you need
  variable: '--font-sans', // Custom CSS variable name for your font
  display: 'swap', // Optional: controls how the font is displayed (swap, fallback, etc.)
  fallback: ['Helvetica', 'Arial', 'sans-serif'], // Fallback fonts
});

export const metadata: Metadata = {
  applicationName: 'BiznaTop',
  title: {
    default: 'BiznaTop',
    template: '%s - BiznaTop',
  },
  description: 'Serving from 2020',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BiznaTop',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
    ],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#FFFFFF',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#09090A',
    },
  ],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning={process.env.NODE_ENV !== 'development'}
    >
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {modal}
          <Toaster />
        </ThemeProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
