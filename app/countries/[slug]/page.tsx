import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CountryDetailClient from './country-detail-client';

// Types
interface Country {
  id: number | string;
  name: string;
  description: string;
  content?: string;
  imageUrl?: string;
  slug: string;
  continent?: string;
  featured?: boolean;
  universities?: { name: string; slug: string }[];
  scholarships?: { title: string; slug: string }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
}

// Fetch country data server-side with ISR
async function getCountry(slug: string): Promise<Country | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/countries/${slug}`, {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch country:', error);
    return null;
  }
}

// Get additional universities for this country
async function getCountryUniversities(countryName: string) {
  try {
    const response = await fetch('http://localhost:5000/api/universities', {
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const universities = await response.json();
    return universities
      .filter((uni: any) => uni.country === countryName)
      .slice(0, 4);
      
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    return [];
  }
}

// Get additional scholarships for this country
async function getCountryScholarships(countryName: string) {
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
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Fetch country data
  const country = await getCountry(params.slug);
  
  if (!country) {
    return {
      title: 'Country Not Found | Study Guru',
      description: 'The requested country could not be found.'
    };
  }
  
  return {
    title: country.seo?.metaTitle || `Study in ${country.name} | Study Guru`,
    description: country.seo?.metaDescription || country.description.substring(0, 160),
    keywords: country.seo?.keywords || `${country.name}, study in ${country.name}, universities in ${country.name}, education in ${country.name}`,
    openGraph: {
      title: `Study in ${country.name}`,
      description: country.description,
      type: 'website',
      images: country.imageUrl ? [{ url: country.imageUrl }] : [],
    }
  };
}

// Server Component for Country Page
export default async function CountryPage({ params }: { params: { slug: string } }) {
  const country = await getCountry(params.slug);
  
  if (!country) {
    notFound();
  }
  
  // Get additional universities and scholarships for this country
  const additionalUniversities = await getCountryUniversities(country.name);
  const additionalScholarships = await getCountryScholarships(country.name);
  
  // Merge the universities and scholarships from the country with the additional ones
  const universities = [
    ...(country.universities || []).map(uni => ({ name: uni.name, slug: uni.slug })),
    ...additionalUniversities.map((uni: any) => ({ name: uni.name, slug: uni.slug }))
  ];
  
  const scholarships = [
    ...(country.scholarships || []).map(sch => ({ title: sch.title, slug: sch.slug })),
    ...additionalScholarships.map((sch: any) => ({ title: sch.title, slug: sch.slug }))
  ];
  
  // Make sure we don't have duplicates
  const uniqueUniversities = [...new Map(universities.map(uni => [uni.slug, uni])).values()];
  const uniqueScholarships = [...new Map(scholarships.map(sch => [sch.slug, sch])).values()];
  
  return <CountryDetailClient 
    country={{
      ...country,
      universities: uniqueUniversities,
      scholarships: uniqueScholarships
    }}
  />;
}