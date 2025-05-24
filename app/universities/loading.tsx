import React from 'react';
import { Skeleton } from '../components/ui/skeleton';

export default function UniversitiesLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header Loading State */}
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-5 w-2/4 mx-auto" />
          </div>
          
          {/* Featured Universities Loading */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-9 w-24" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="relative overflow-hidden rounded-xl shadow-md border border-border h-64 bg-card">
                  <Skeleton className="h-full w-full" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <Skeleton className="h-7 w-36 mb-2" />
                    <Skeleton className="h-4 w-48 mb-3" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabs Loading State */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-10 w-full md:w-64 lg:w-80" />
            </div>
            
            {/* Filters Loading State */}
            <div className="bg-card rounded-lg p-4 mb-8 shadow-sm border border-border">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
            
            {/* Universities Grid Loading State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}