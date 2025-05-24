'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Share2,
  List,
  ChevronRight,
  MessageCircle,
  BookOpen,
  BookmarkPlus,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import RichTextContent from '@/components/RichTextContent';
import ChatBot from '@/components/ChatBot';

// Define the Article type
interface Article {
  id: string | number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
  isFeatured?: boolean;
  relatedArticles?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  views?: number;
  readingTime?: string;
  helpful?: {
    yes: number;
    no: number;
  };
  tableOfContents?: {
    id: string;
    title: string;
    level: number;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  tags?: string[];
}

// Related article card component
const RelatedArticleCard = ({ article }: { article: Article }) => {
  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => window.location.href = `/articles/${article.slug}`}
    >
      {article.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            width="800"
            height="160"
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(article.publishDate)}</span>
          </div>
          {article.readingTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{article.readingTime}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ArticleDetailProps {
  article: Article;
  allArticles: Article[];
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, allArticles }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  // Initialize helpful vote from localStorage if available
  const [helpfulVote, setHelpfulVote] = useState<'yes' | 'no' | null>(() => {
    if (typeof window !== 'undefined') {
      const savedVote = localStorage.getItem(`article-vote-${article.slug}`);
      return (savedVote === 'yes' || savedVote === 'no') ? savedVote : null;
    }
    return null;
  });

  // Filter related articles
  const relatedArticles = allArticles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  // Increment view count when article loads (would be a real API call in production)
  useEffect(() => {
    // This would be an API call in a real app
    const incrementViews = async () => {
      try {
        await fetch(`/api/articles/${article.slug}/view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };
    incrementViews();
  }, [article.slug]);

  // Handle helpful vote
  const handleHelpfulVote = async (vote: 'yes' | 'no') => {
    if (helpfulVote === vote) return; // Already voted the same way

    try {
      // This would be an API call in a real app
      await fetch(`/api/articles/${article.slug}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful: vote }),
      });

      setHelpfulVote(vote);
      localStorage.setItem(`article-vote-${article.slug}`, vote);
    } catch (error) {
      console.error('Error submitting helpful vote:', error);
    }
  };

  // Observe sections for active highlighting
  useEffect(() => {
    if (!article.tableOfContents || article.tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    article.tableOfContents.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      article.tableOfContents?.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [article.tableOfContents]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {article ? (
          <div>
            <div className="mb-6">
              <Button 
                variant="ghost" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium p-0 h-auto"
                asChild
              >
                <Link href="/articles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </Link>
              </Button>
            </div>

            {/* Mobile Table of Contents Toggle */}
            {article.tableOfContents && article.tableOfContents.length > 0 && (
              <div className="lg:hidden mb-6">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowTableOfContents(!showTableOfContents)}
                >
                  <span className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    Table of Contents
                  </span>
                  {showTableOfContents ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>

                <AnimatePresence>
                  {showTableOfContents && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-4 border border-border rounded-lg bg-card">
                        <ul className="space-y-2">
                          {article.tableOfContents.map((section) => (
                            <li key={section.id} style={{ marginLeft: `${(section.level - 1) * 16}px` }}>
                              <a
                                href={`#${section.id}`}
                                className={`block py-1 text-sm hover:text-primary transition-colors ${
                                  activeSection === section.id ? 'text-primary font-medium' : 'text-muted-foreground'
                                }`}
                                onClick={() => setShowTableOfContents(false)}
                              >
                                {section.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Article Content */}
              <div className="lg:col-span-2">
                <article className="bg-card shadow-sm rounded-xl overflow-hidden">
                  {article.image && (
                    <div className="h-64 md:h-96 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        width="1200"
                        height="400"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{article.title}</h1>
                    
                    <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-x-6 gap-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(article.publishDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{article.author}</span>
                      </div>
                      {article.readingTime && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{article.readingTime} read</span>
                        </div>
                      )}
                      {article.views !== undefined && (
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                      )}
                    </div>

                    {article.summary && (
                      <div className="bg-accent/10 border-l-4 border-primary p-4 rounded mb-8">
                        <p className="italic text-foreground">{article.summary}</p>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <RichTextContent content={article.content} />
                    </div>

                    {/* FAQs Section */}
                    {article.faqs && article.faqs.length > 0 && (
                      <div className="mt-12 border-t border-border pt-8">
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                          {article.faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${index}`}>
                              <AccordionTrigger className="text-base md:text-lg font-medium">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {/* Helpful Vote */}
                    <div className="mt-12 border-t border-border pt-8">
                      <h3 className="text-lg font-medium mb-4">Was this article helpful?</h3>
                      <div className="flex space-x-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={helpfulVote === 'yes' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleHelpfulVote('yes')}
                                className={helpfulVote === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}
                              >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Yes
                                {article.helpful && (
                                  <span className="ml-2 text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                    {article.helpful.yes}
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This article was helpful</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant={helpfulVote === 'no' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleHelpfulVote('no')}
                                className={helpfulVote === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}
                              >
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                No
                                {article.helpful && (
                                  <span className="ml-2 text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                    {article.helpful.no}
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This article needs improvement</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share this article</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author Bio */}
                    {article.author && (
                      <div className="mt-12 border-t border-border pt-8">
                        <div className="flex items-start">
                          {article.authorImage ? (
                            <img
                              src={article.authorImage}
                              alt={article.author}
                              className="h-12 w-12 rounded-full mr-4"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{article.author}</h3>
                            {article.authorTitle && (
                              <p className="text-sm text-muted-foreground">{article.authorTitle}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-xl font-bold mb-6">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {relatedArticles.map((relatedArticle) => (
                        <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat with AI Assistant */}
                <div className="mt-12">
                  <ChatBot initialMessage={`Do you have questions about "${article.title}"? I'm here to help!`} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Table of Contents - Desktop */}
                {article.tableOfContents && article.tableOfContents.length > 0 && (
                  <div className="hidden lg:block sticky top-20">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center">
                          <List className="h-5 w-5 mr-2" />
                          Table of Contents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {article.tableOfContents.map((section) => (
                            <li 
                              key={section.id} 
                              style={{ marginLeft: `${(section.level - 1) * 16}px` }}
                            >
                              <a
                                href={`#${section.id}`}
                                className={`block py-1 text-sm hover:text-primary transition-colors ${
                                  activeSection === section.id ? 'text-primary font-medium' : 'text-muted-foreground'
                                }`}
                              >
                                {section.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Get Help Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Have Questions?</CardTitle>
                    <CardDescription>Our experts are ready to help</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Need personalized advice about studying abroad? Reach out to our experienced consultants.
                    </p>
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Get Expert Advice
                    </Button>
                  </CardContent>
                </Card>

                {/* Search Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search Articles</CardTitle>
                    <CardDescription>Find more educational resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value;
                            window.location.href = `/search?q=${encodeURIComponent(value)}`;
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pb-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link href="/articles">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Browse All Articles
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">We couldn't find the article you're looking for.</p>
            <Button asChild>
              <Link href="/articles">
                Back to Articles
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleDetail;