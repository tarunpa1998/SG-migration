import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ScholarshipDetailClient from './scholarship-detail-client';
import { headers } from 'next/headers';

// Types
interface Scholarship {
  id: number | string;
  title: string;
  description: string;
  content: string;
  amount: string;
  deadline: string;
  country: string;
  tags: string[];
  slug: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  benefits?: string[];
  overview?: string;
  eligibility?: string | string[];
  applicationProcedure?: string;
  link?: string;
  highlights?: string[];
  fieldsCovered?: string[];
  duration?: string;
  level?: string;
  isRenewable?: boolean;
}

// Fetch scholarship data server-side with ISR
async function getScholarship(slug: string): Promise<Scholarship | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/scholarships/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch scholarship:', error);
    return null;
  }
}

// Get related scholarships
async function getRelatedScholarships(country: string, currentSlug: string): Promise<Scholarship[]> {
  try {
    const response = await fetch('http://localhost:5000/api/scholarships', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const scholarships: Scholarship[] = await response.json();
    return scholarships
      .filter(s => s.country === country && s.slug !== currentSlug)
      .slice(0, 3);
      
  } catch (error) {
    console.error('Failed to fetch related scholarships:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Extract the slug directly to avoid params.slug access error
    const slug = String(params.slug);
    
    // Use the slug to fetch scholarship data
    const scholarship = await getScholarship(slug);
    
    if (!scholarship) {
      return {
        title: 'Scholarship Not Found | Study Guru',
        description: 'The requested scholarship could not be found.'
      };
    }
    
    return {
      title: scholarship.seo?.metaTitle || `${scholarship.title} | Study Guru`,
      description: scholarship.seo?.metaDescription || scholarship.description.substring(0, 160),
      keywords: scholarship.seo?.keywords || scholarship.tags.join(', '),
      openGraph: {
        title: scholarship.title,
        description: scholarship.description.substring(0, 160),
        type: 'website',
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Scholarship | Study Guru',
      description: 'Find scholarships for your international education journey.'
    };
  }
}

// Server Component for Scholarship Page
export default async function ScholarshipPage({ params }: { params: { slug: string } }) {
  // To avoid params.slug access error, extract it as string first
  const slug = String(params.slug);
  
  try {
    // Use extracted slug instead of directly accessing params.slug
    const scholarship = await getScholarship(slug);
    
    if (!scholarship) {
      return notFound();
    }
    
    // Get related scholarships from the same country
    const relatedScholarships = await getRelatedScholarships(scholarship.country, slug);
    
    // Add any missing properties to match Vite app schema
    const enhancedScholarship = {
      ...scholarship,
      duration: scholarship.duration || 'Variable',
      level: scholarship.level || 'Multiple',
      isRenewable: scholarship.isRenewable || false
    };
    
    return <ScholarshipDetailClient scholarship={enhancedScholarship} relatedScholarships={relatedScholarships} />;
  } catch (error) {
    console.error('Error in scholarship page:', error);
    return notFound();
  }
}