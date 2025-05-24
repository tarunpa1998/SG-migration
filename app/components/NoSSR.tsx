'use client';

import React, { useEffect, useState } from 'react';

// Component to prevent server-side rendering of children
export function NoSSR({ children }: { children: React.ReactNode }) {
  // State to track if we're in the browser
  const [isClient, setIsClient] = useState(false);

  // Only set isClient to true on the client-side after first render
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null on server
  if (!isClient) {
    return null;
  }

  // Return children only on the client
  return <>{children}</>;
}