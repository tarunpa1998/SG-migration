import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UniversityDetailClient from './university-detail-client';

// Types
interface University {
  id: number | string;
  name: string;
  description: string;
  content?: string;
  imageUrl?: string;
  country: string;
  countrySlug?: string;
  slug: string;
  website?: string;
  ranking?: number;
  foundedYear?: number;
  programs?: { name: string; level: string; duration: string }[];
  scholarships?: { title: string; slug: string }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  acceptanceRate?: string;
  studentPopulation?: number;
  internationalStudents?: string;
  overview?: string;
  facilities?: string[];
  highlights?: string[];
}

// Fetch university data server-side with ISR
async function getUniversity(slug: string): Promise<University | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/universities/${slug}`, {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch university:', error);
    return null;
  }
}

// Get scholarships for this university's country
async function getCountryScholarships(countryName: string | undefined) {
  if (!countryName) return [];
  
  try {
    const response = await fetch('http://localhost:5000/api/scholarships', {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const scholarships = await response.json();
    return scholarships
      .filter((scholarship: any) => scholarship.country === countryName)
      .slice(0, 3);
      
  } catch (error) {
    console.error('Failed to fetch scholarships:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  // Fetch university data
  const university = await getUniversity(params.slug);
  
  if (!university) {
    return {
      title: 'University Not Found | Study Guru',
      description: 'The requested university could not be found.'
    };
  }
  
  return {
    title: university.seo?.metaTitle || `${university.name} | Study Guru`,
    description: university.seo?.metaDescription || university.description.substring(0, 160),
    keywords: university.seo?.keywords || `${university.name}, study at ${university.name}, programs at ${university.name}, ${university.country} university`,
    openGraph: {
      title: `${university.name} - Study Abroad | Study Guru`,
      description: university.description,
      type: 'website',
      images: university.imageUrl ? [{ url: university.imageUrl }] : [],
    }
  };
}

// Server Component for University Page
export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const university = await getUniversity(params.slug);
  
  if (!university) {
    notFound();
  }
  
  // Get scholarships for this university's country
  const scholarships = await getCountryScholarships(university.country);
  
  return <UniversityDetailClient university={university} scholarships={scholarships} />;
}