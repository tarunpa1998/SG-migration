import React from 'react';
import { Skeleton } from '../../components/ui/skeleton';

export default function CountryDetailsLoading() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section Loading */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <Skeleton className="h-5 w-32 mb-4 bg-white/30" />
            <Skeleton className="h-12 w-80 mb-4 bg-white/30" />
            <Skeleton className="h-5 w-full max-w-xl bg-white/30" />
          </div>
        </div>
      </div>
      
      {/* Content Section Loading */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Loading */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              
              <div className="pt-4">
                <Skeleton className="h-8 w-72 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <Skeleton className="h-8 w-64 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Call to Action Loading */}
            <div className="mt-10 p-6 bg-primary/10 border border-primary/20 rounded-lg">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          
          {/* Sidebar Loading */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-40 mb-6" />
              
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}