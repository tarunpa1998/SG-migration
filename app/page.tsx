import React, { Suspense } from 'react';
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import FeaturedScholarships from "./components/FeaturedScholarships";
import { fetchScholarships, fetchCountries, fetchArticles, fetchNews } from './lib/api';
import { Skeleton } from "@/components/ui/skeleton";
import ClientSideComponents from './components/ClientSideComponents';

// Use Next.js page-level config for ISR
export const revalidate = 60; // Revalidate this page every 60 seconds

// This is a server component that fetches data on the server
export default async function Home() {
  // Fetch data server-side for better SEO and performance with ISR
  const scholarships = await fetchScholarships();
  const countries = await fetchCountries();
  const articles = await fetchArticles();
  const news = await fetchNews();

  return (
    <main>
      <Hero />
      {/* Ensure proper SSR for these sections */}
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <CategorySection countries={countries} />
      </Suspense>
      
      <Suspense fallback={<div className="h-[400px]"><Skeleton className="h-full w-full" /></div>}>
        <FeaturedScholarships scholarships={scholarships} />
      </Suspense>
      
      {/* Client components will handle their own hydration */}
      <div suppressHydrationWarning={true}>
        {/* @ts-ignore - This is intentional for hydration mismatch prevention */}
        <ClientSideComponents
          initialCountries={countries} 
          initialArticles={articles}
          initialNews={news}
        />
      </div>
    </main>
  );
}