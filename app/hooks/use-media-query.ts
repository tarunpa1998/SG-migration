'use client';

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only run on client
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      // Set initial value
      setMatches(mediaQuery.matches);
      
      // Create event listener
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      
      // Add listener
      mediaQuery.addEventListener("change", listener);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener("change", listener);
      };
    }
  }, [query]);

  // For SSR, default to false to avoid hydration issues
  if (!mounted) return false;
  
  return matches;
}