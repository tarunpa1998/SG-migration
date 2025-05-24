import { Metadata } from 'next';
import NewsDetail from './news-detail';
import { notFound } from 'next/navigation';

interface NewsPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fetch news item data
async function getNewsItem(slug: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/news/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching news item:', error);
    return null;
  }
}

// Fetch all news items
async function getAllNews() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/news`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all news:', error);
    return [];
  }
}

// Generate metadata for the page dynamically based on the news item data
export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const newsItem = await getNewsItem(slug);
  
  if (!newsItem) {
    return {
      title: 'News Not Found | Study Guru',
      description: 'The news item you were looking for could not be found.',
    };
  }
  
  // Return the metadata
  return {
    title: `${newsItem.title} | Study Guru News`,
    description: newsItem.summary || 'Read the latest news on Study Guru',
    // Add more metadata as needed
  };
}

export default async function NewsPage({
  params,
}: NewsPageProps) {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const newsItem = await getNewsItem(slug);
  
  if (!newsItem) {
    return notFound();
  }
  
  // Fetch all news items for related news section
  const allNews = await getAllNews();
  
  return <NewsDetail newsItem={newsItem} allNews={allNews} />;
}

