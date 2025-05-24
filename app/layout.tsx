import './styles/globals.css';
import { Metadata } from "next";
import React from 'react';
import { Providers } from './providers';
import RootLayoutInner from './RootLayoutClient';

export const metadata: Metadata = {
  title: 'Study Guru - Your Guide to International Education',
  description: 'Discover scholarships, universities, and essential information for international students seeking education abroad.',
  keywords: 'international education, study abroad, scholarships, universities, student guide',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <RootLayoutInner>{children}</RootLayoutInner>
        </Providers>
      </body>
    </html>
  );
}