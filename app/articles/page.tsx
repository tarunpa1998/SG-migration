import React from 'react';
import { Metadata } from 'next';
import ArticlesClient, { Article } from './articles-client';

// Export metadata for SEO
export const metadata: Metadata = {
  title: 'Articles | Study Guru',
  description: 'Explore expert advice and real student experiences in our collection of international education articles.',
};

// Fetch articles with ISR
export const revalidate = 3600; // Revalidate every hour

async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch('http://localhost:5000/api/articles', {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Server component
export default async function ArticlesPage() {
  const articles = await getArticles();
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Articles & Guides
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore expert advice, tips, and real student experiences to help you 
              navigate your international education journey.
            </p>
          </div>
          
          {/* Client-side component for interactive features */}
          <ArticlesClient initialArticles={articles} />
        </div>
      </div>
    </div>
  );
}