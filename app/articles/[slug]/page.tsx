import { Metadata } from 'next';
import ArticleDetail from './article-detail';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fetch article data
async function getArticle(slug: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/articles/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch all articles
async function getAllArticles() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/articles`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}

// Generate metadata for the page dynamically based on the article data
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Study Guru',
      description: 'The article you were looking for could not be found.',
    };
  }
  
  // Return the metadata
  return {
    title: `${article.title} | Study Guru`,
    description: article.excerpt || 'Read this informative article on Study Guru',
    // Add more metadata as needed
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  // Ensure params is properly typed and accessed
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getArticle(slug);
  
  if (!article) {
    return notFound();
  }
  
  const allArticles = await getAllArticles();
  
  return <ArticleDetail article={article} allArticles={allArticles} />;
}
