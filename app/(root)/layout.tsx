import '../[lang]/globals.css';
import Header from '@/components/Header';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { metadata as LangMetaData } from '../[lang]/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = LangMetaData;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === 'production' && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2659609409731056"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Header lang="en" />
        {children}
      </body>
    </html>
  );
}
