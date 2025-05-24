import React from 'react';
import { Skeleton } from '../components/ui/skeleton';

export default function ScholarshipsLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header Loading State */}
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-5 w-2/4 mx-auto" />
          </div>
          
          {/* Filters Loading State */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border border-border">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>
          
          {/* Scholarships Grid Loading State */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="bg-card rounded-2xl shadow-md overflow-hidden border border-border">
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-5" />
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-border px-6 py-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
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