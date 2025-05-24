import { Metadata } from 'next';
import CountryDetail from './country-detail-client';
import { notFound } from 'next/navigation';

interface CountryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fetch country data
async function getCountry(slug: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/countries/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
}

// Generate metadata for the page dynamically based on the country data
export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const country = await getCountry(slug);
  
  if (!country) {
    return {
      title: 'Country Not Found | Study Guru',
      description: 'The country you were looking for could not be found.',
    };
  }
  
  // Return the metadata
  return {
    title: `Study in ${country.name} | Study Guru`,
    description: `Learn about studying in ${country.name} - universities, scholarships, and more.`,
    // Add more metadata as needed
  };
}

export default async function CountryPage({
  params,
}: CountryPageProps) {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const country = await getCountry(slug);
  
  if (!country) {
    return notFound();
  }
  
  return <CountryDetail country={country} />;
}





