import { Metadata } from 'next';
import ArticleDetail from './article-detail';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    slug: string;
  };
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
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Ensure params is properly typed and accessed
  const slug = params.slug;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Study Guru',
      description: 'The article you were looking for could not be found.',
    };
  }
  
  return {
    title: article.seo?.metaTitle || `${article.title} | Study Guru`,
    description: article.seo?.metaDescription || article.summary,
    keywords: article.seo?.keywords || article.tags,
    openGraph: {
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.summary,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${slug}`,
      images: article.image ? [{ url: article.image }] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  // Ensure params is properly typed and accessed
  const slug = params.slug;
  const article = await getArticle(slug);
  
  if (!article) {
    return notFound();
  }
  
  const allArticles = await getAllArticles();
  
  return <ArticleDetail article={article} allArticles={allArticles} />;
}