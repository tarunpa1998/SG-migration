import React from 'react';
import { Skeleton } from '../components/ui/skeleton';

export default function ArticlesLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header Loading State */}
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-5 w-2/4 mx-auto" />
          </div>
          
          {/* Featured Article Loading */}
          <div className="mb-16 relative overflow-hidden rounded-xl shadow-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Skeleton className="h-80 md:h-96" />
              
              <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-9 w-4/5 mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-5 w-48 mb-6" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </div>
          
          {/* Search and Filters Loading State */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border border-border">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-grow" />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
          
          {/* Articles Grid Loading State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-7 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-48 mb-4" />
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                  
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Loading State */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}