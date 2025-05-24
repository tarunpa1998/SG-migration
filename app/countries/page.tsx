import React from 'react';
import { Metadata } from 'next';
import CountriesClient, { Country } from './countries-client';

// Export metadata for SEO
export const metadata: Metadata = {
  title: 'Study Destinations | Study Guru',
  description: 'Explore popular study abroad destinations for international students. Find information about universities, scholarships, and education systems.',
};

// Fetch countries with ISR
export const revalidate = 3600; // Revalidate every hour

async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('http://localhost:5000/api/countries', {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

// Server component
export default async function CountriesPage() {
  const countries = await getCountries();
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Study Destinations
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore popular countries for international education, compare key factors, 
              and find detailed information about each destination.
            </p>
          </div>
          
          {/* Client-side component for interactive features */}
          <CountriesClient initialCountries={countries} />
        </div>
      </div>
    </div>
  );
}