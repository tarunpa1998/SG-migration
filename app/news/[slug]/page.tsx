import { Metadata } from 'next';
import NewsDetailPage from './news-detail';
import { notFound } from 'next/navigation';

// Fetch news item data
async function getNewsItem(slug: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/news/${slug}`, {
      cache: 'no-store'
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

// Fetch all news
async function getAllNews() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/news`, {
      cache: 'no-store'
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

// Generate metadata for the page dynamically based on the news article data
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Access slug directly from params
  const slug = params.slug;
  
  // Get news data
  const newsItem = await getNewsItem(slug);
  
  if (!newsItem) {
    return {
      title: 'News Article Not Found | Study Guru',
      description: 'The requested news article could not be found.'
    };
  }
  
  return {
    title: newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`,
    description: newsItem.seo?.metaDescription || newsItem.summary,
    keywords: newsItem.seo?.keywords || [],
    openGraph: {
      title: newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`,
      description: newsItem.seo?.metaDescription || newsItem.summary,
      images: newsItem.image ? [{ url: newsItem.image }] : [],
      type: 'article',
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: { slug: string };
}) {
  // Access slug directly from params
  const slug = params.slug;
  
  // Get news data
  const newsItem = await getNewsItem(slug);
  
  if (!newsItem) {
    return notFound();
  }
  
  const allNews = await getAllNews();
  
  return <NewsDetailPage newsItem={newsItem} allNews={allNews} />;
}