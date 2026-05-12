import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'DevFolio — your developer life, in one terminal',
  description:
    'Public developer portfolio that aggregates your GitHub activity, learning streaks, and pinned snippets. The hub of the dev ecosystem.',
  metadataBase: new URL('https://devfolio.local'),
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    title: 'DevFolio',
    description: 'Public developer portfolio — terminal-style.',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grid-bg min-h-screen">
        <Navbar />
        <main className="relative z-10 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
