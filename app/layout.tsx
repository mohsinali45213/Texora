import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/context/providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Texora — AI-Powered B2B Textile Marketplace',
    template: '%s | Texora',
  },
  description:
    'Source Smarter. Trade Faster.',
  openGraph: {
    title: 'Texora — AI-Powered B2B Textile Marketplace',
    description: 'Source Smarter. Trade Faster.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/logo/app-icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo/app-icon.svg',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
