import React from 'react';
import { Metadata } from 'next';
import UniversitiesClient from './universities-client';

// Types
interface University {
  id: number | string;
  name: string;
  description: string;
  country: string;
  countrySlug?: string;
  imageUrl?: string;
  slug: string;
  featured?: boolean;
  ranking?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
}

// Define metadata for SEO
export const metadata: Metadata = {
  title: 'Universities | Study Guru',
  description: 'Browse leading universities from around the world. Find information about programs, rankings, and admission requirements.',
  keywords: 'universities, international universities, study abroad, higher education, colleges, academic institutions',
};

// Fetch all universities with ISR
async function getUniversities() {
  try {
    const response = await fetch('http://localhost:5000/api/universities', {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
}

// Group universities by country
function groupUniversitiesByCountry(universities: University[]) {
  const countries: Record<string, University[]> = {};
  
  universities.forEach(university => {
    const country = university.country || 'Other';
    if (!countries[country]) {
      countries[country] = [];
    }
    countries[country].push(university);
  });
  
  return countries;
}

// Server Component for Universities Page
export default async function UniversitiesPage() {
  const universities = await getUniversities();
  const universitiesByCountry = groupUniversitiesByCountry(universities);
  
  // Get featured universities for the top section
  const featuredUniversities = universities.filter((university: University) => university.featured);
  // Sort universities by ranking (if available)
  const topRankedUniversities = [...universities]
    .filter((university: University) => university.ranking)
    .sort((a: University, b: University) => (a.ranking || 0) - (b.ranking || 0))
    .slice(0, 10);
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Top Universities Worldwide
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover information about programs, rankings, admission requirements, 
              and campus life at leading institutions around the world.
            </p>
          </div>
          
          {/* Client-side component for interactive features */}
          <UniversitiesClient 
            initialUniversities={universities} 
            featuredUniversities={featuredUniversities} 
            topRankedUniversities={topRankedUniversities}
            universitiesByCountry={universitiesByCountry} 
          />
        </div>
      </div>
    </div>
  );
}

