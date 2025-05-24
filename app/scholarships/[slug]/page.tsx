import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ScholarshipDetail from './scholarship-detail-client';
import { headers } from 'next/headers';

interface ScholarshipPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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

// Fetch scholarship data
async function getScholarship(slug: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/scholarships/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    return null;
  }
}

// Fetch all scholarships
async function getAllScholarships() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/scholarships`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all scholarships:', error);
    return [];
  }
}

// Generate metadata for the page dynamically based on the scholarship data
export async function generateMetadata({
  params,
}: ScholarshipPageProps): Promise<Metadata> {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const scholarship = await getScholarship(slug);
  
  if (!scholarship) {
    return {
      title: 'Scholarship Not Found | Study Guru',
      description: 'The scholarship you were looking for could not be found.',
    };
  }
  
  // Return the metadata
  return {
    title: `${scholarship.title} | Study Guru Scholarships`,
    description: scholarship.overview || scholarship.description || 'Find details about this scholarship on Study Guru',
    // Add more metadata as needed
  };
}

export default async function ScholarshipPage({
  params,
}: ScholarshipPageProps) {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const scholarship = await getScholarship(slug);
  
  if (!scholarship) {
    return notFound();
  }
  
  // Fetch all scholarships for related scholarships section
  const allScholarships = await getAllScholarships();
  
  // Filter to get related scholarships (same country, excluding current one)
  const relatedScholarships = allScholarships
    .filter((s: Scholarship) => 
      s.country === scholarship.country && s.slug !== scholarship.slug
    )
    .slice(0, 3); // Limit to 3 related scholarships
  
  return <ScholarshipDetail scholarship={scholarship} relatedScholarships={relatedScholarships} />;
}

