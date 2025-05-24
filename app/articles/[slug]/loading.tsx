import React from 'react';
import { Skeleton } from '../../components/ui/skeleton';

export default function ArticleDetailsLoading() {
  return (
    <main className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Skeleton className="h-5 w-32" />
          </div>
          
          {/* Article Header Loading */}
          <header className="mb-8">
            <Skeleton className="h-10 w-4/5 mb-4" />
            <Skeleton className="h-6 w-full mb-6" />
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </header>
          
          {/* Featured Image Loading */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <Skeleton className="h-96 w-full" />
          </div>
          
          {/* Article Content Loading */}
          <article className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-4/5 mb-4" />
            
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-4" />
            
            <Skeleton className="h-7 w-48 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-4" />
            
            <Skeleton className="h-64 w-full mb-4 rounded-lg" />
            
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-4/5 mb-4" />
          </article>
          
          {/* Tags and Share Loading */}
          <div className="flex flex-wrap justify-between items-center py-6 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            
            <Skeleton className="h-8 w-20" />
          </div>
          
          {/* Related Articles Loading */}
          <div className="mt-12 py-8 border-t border-border">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-4/5 mb-2" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}