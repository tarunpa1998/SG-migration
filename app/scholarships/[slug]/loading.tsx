import React from 'react';
import { Skeleton } from '../../components/ui/skeleton';

export default function ScholarshipDetailsLoading() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center mb-4">
              <Skeleton className="h-5 w-36 bg-white/30" />
            </div>
            <Skeleton className="h-10 w-3/4 mb-4 bg-white/30" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
              <Skeleton className="h-6 w-24 rounded-full bg-white/30" />
              <Skeleton className="h-6 w-16 rounded-full bg-white/30" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border border-border rounded-lg p-4 bg-background">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="border border-border rounded-lg p-4 bg-background">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="border border-border rounded-lg p-4 bg-background">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              
              <div className="my-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-5/6 mb-2" />
              </div>
              
              <Skeleton className="h-8 w-52 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-2" />
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="bg-secondary/30 rounded-lg p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}