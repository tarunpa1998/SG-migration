'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";

// Load components dynamically to avoid hydration mismatches
const FloatingWhatsApp = React.lazy(() => import('./FloatingWhatsApp'));
const ScrollProgressCircle = React.lazy(() => import('./ScrollProgressCircle'));
const HomeChatBot = React.lazy(() => import('./HomeChatBot'));
const CTASection = React.lazy(() => import('./CTASection'));
const Testimonials = React.lazy(() => import('./Testimonials'));
const FeaturedNewsCarousel = React.lazy(() => import('./FeaturedNewsCarousel'));

// We're handling these separately to control data loading
const LazyPopularDestinations = React.lazy(() => import('./PopularDestinations'));
const LazyLatestArticles = React.lazy(() => import('./LatestArticles'));
const LazyEducationNews = React.lazy(() => import('./EducationNews'));

interface ClientSideComponentsProps {
  initialCountries: any[];
  initialArticles: any[];
  initialNews: any[];
}

// Create a wrapper with its own QueryClient to avoid hydration issues
function ClientSideComponentsContent({
  initialCountries,
  initialArticles,
  initialNews
}: ClientSideComponentsProps) {
  // Only run after hydration is complete
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Pre-populate React Query cache with server data
  useQuery({
    queryKey: ['/api/countries'],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/countries`);
      if (!response.ok) return initialCountries || [];
      return response.json();
    },
    initialData: initialCountries || [],
    staleTime: 60 * 1000, // 1 minute
    enabled: isHydrated
  });

  useQuery({
    queryKey: ['/api/articles'],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/articles`);
      if (!response.ok) return initialArticles || [];
      return response.json();
    },
    initialData: initialArticles || [],
    staleTime: 60 * 1000, // 1 minute
    enabled: isHydrated
  });

  useQuery({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/news`);
      if (!response.ok) return initialNews || [];
      return response.json();
    },
    initialData: initialNews || [],
    staleTime: 60 * 1000, // 1 minute
    enabled: isHydrated
  });

  // Mark as hydrated after first render on the client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return a simple placeholder during server-side rendering
    return (
      <div aria-hidden="true">
        <div className="py-12">
          <div className="container mx-auto px-4 grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <LazyPopularDestinations />
      </Suspense>
      
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <LazyLatestArticles />
      </Suspense>
      
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <LazyEducationNews />
      </Suspense>
      
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <FeaturedNewsCarousel />
      </Suspense>
      
      <Suspense fallback={<div className="h-[200px]"><Skeleton className="h-full w-full" /></div>}>
        <HomeChatBot />
      </Suspense>
      
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<div className="h-[200px]"><Skeleton className="h-full w-full" /></div>}>
        <CTASection />
      </Suspense>
      
      <Suspense fallback={null}>
        <FloatingWhatsApp />
      </Suspense>
      
      <Suspense fallback={null}>
        <ScrollProgressCircle />
      </Suspense>
    </>
  );
}

// Wrapper to provide separate QueryClient to avoid hydration issues
export default function ClientSideComponents(props: ClientSideComponentsProps) {
  // Create a client for this component tree
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ClientSideComponentsContent {...props} />
    </QueryClientProvider>
  );
}