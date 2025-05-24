'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollProgressCircle from './components/ScrollProgressCircle';

export default function RootLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add a client-side only state to help with hydration
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      
      {/* Only render these components after hydration */}
      {mounted && (
        <>
          <FloatingWhatsApp />
          <ScrollProgressCircle />
        </>
      )}
    </div>
  );
}