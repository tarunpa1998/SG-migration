import { Metadata } from 'next';
import UniversityDetailClient from './university-detail-client';
import { notFound } from 'next/navigation';

interface UniversityPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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
  tuitionFees?: {
    international?: string;
    domestic?: string;
  };
  admissionRequirements?: string;
}

interface Scholarship {
  id: number | string;
  title: string;
  description: string;
  content?: string;
  amount: string;
  deadline: string;
  country: string;
  tags: string[];
  slug: string;
}

// Fetch university data
async function getUniversity(slug: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/universities/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching university:', error);
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

// Generate metadata for the page dynamically based on the university data
export async function generateMetadata({
  params,
}: UniversityPageProps): Promise<Metadata> {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const university = await getUniversity(slug);
  
  if (!university) {
    return {
      title: 'University Not Found | Study Guru',
      description: 'The university you were looking for could not be found.',
    };
  }
  
  // Return the metadata
  return {
    title: `${university.name} | Study Guru Universities`,
    description: university.description || `Learn about ${university.name} - programs, admissions, and more.`,
    // Add more metadata as needed
  };
}

export default async function UniversityPage({
  params,
}: UniversityPageProps) {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const university = await getUniversity(slug);
  
  if (!university) {
    return notFound();
  }
  
  // Fetch all scholarships for related scholarships section
  const allScholarships = await getAllScholarships();
  
  // Filter to get scholarships for the university's country
  const scholarships = allScholarships
    .filter((s: Scholarship) => s.country === university.country)
    .slice(0, 5); // Limit to 5 scholarships
  
  return <UniversityDetailClient university={university} scholarships={scholarships} />;
}

