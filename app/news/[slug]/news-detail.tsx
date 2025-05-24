'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
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
import ChatBot from '@/components/ChatBot';
import RichTextContent from '@/components/RichTextContent';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';

// Define the News type
interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  image?: string;
  category: string;
  isFeatured: boolean;
  relatedArticles?: string[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
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
}

// Related news card component
const RelatedNewsCard = ({ newsItem }: { newsItem: NewsItem }) => {
  const { theme } = useTheme();

  return (
    <Link href={`/news/${newsItem.slug}`} className="block w-full">
      <motion.div
        className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {newsItem.image && (
          <div className="h-40 overflow-hidden relative">
            <Image 
              src={newsItem.image} 
              alt={newsItem.title} 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{newsItem.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{newsItem.summary}</p>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(newsItem.publishDate)}</span>
            </div>
            {newsItem.readingTime && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{newsItem.readingTime}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

interface NewsDetailProps {
  newsItem: NewsItem;
  allNews: NewsItem[];
}

const NewsDetailPage = ({ newsItem, allNews }: NewsDetailProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [helpfulVote, setHelpfulVote] = useState<'yes' | 'no' | null>(null);
  const [relatedNewsData, setRelatedNewsData] = useState<NewsItem[]>([]);
  
  // Initialize helpful vote from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined' && newsItem?.slug) {
      const savedVote = localStorage.getItem(`news-vote-${newsItem.slug}`);
      if (savedVote === 'yes' || savedVote === 'no') {
        setHelpfulVote(savedVote);
      }
    }
  }, [newsItem?.slug]);

  // Update view count when news item loads
  useEffect(() => {
    if (newsItem && newsItem.slug) {
      // Increment view count in the database
      fetch(`/api/news/${newsItem.slug}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .catch(error => console.error('Error updating news view count:', error));
    }
  }, [newsItem?.slug]);

  // Set up related news items
  useEffect(() => {
    if (newsItem?.relatedArticles && newsItem.relatedArticles.length > 0) {
      const fetchRelatedNews = async () => {
        try {
          const slugs = newsItem.relatedArticles || [];
          const promises = slugs.map(async (relatedSlug) => {
            const response = await fetch(`/api/news/${relatedSlug}`);
            if (response.ok) {
              return await response.json();
            }
            return null;
          });
          
          const results = await Promise.all(promises);
          setRelatedNewsData(results.filter(Boolean));
        } catch (error) {
          console.error("Error fetching related news:", error);
        }
      };
      
      fetchRelatedNews();
    } else {
      // Fallback to filtering all news by category
      const related = allNews
        .filter(item => item.category === newsItem?.category && item.slug !== newsItem.slug)
        .slice(0, 3);
      setRelatedNewsData(related);
    }
  }, [newsItem, allNews]);

  // Handle scroll to section when clicking on table of contents
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Adjust for header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
      
      // On mobile, close the table of contents after clicking
      if (window.innerWidth < 768) {
        setShowTableOfContents(false);
      }
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    if (!newsItem?.tableOfContents) return;
    
    const handleScroll = () => {
      // Safely access tableOfContents
      const tocItems = newsItem.tableOfContents || [];
      const sections = tocItems.map(item => document.getElementById(item.id));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [newsItem]);

  // Handle helpful votes
  const handleHelpfulVote = async (vote: 'yes' | 'no') => {
    if (!newsItem) return;
    
    // Toggle vote if clicking the same button
    const newVoteValue = helpfulVote === vote ? null : vote;
    setHelpfulVote(newVoteValue);
    
    // Store vote in localStorage
    if (newVoteValue) {
      localStorage.setItem(`news-vote-${newsItem.slug}`, newVoteValue);
    } else {
      localStorage.removeItem(`news-vote-${newsItem.slug}`);
    }
    
    try {
      // Calculate the new vote counts - if removing a vote, decrement current value
      const currentYesCount = newsItem.helpful?.yes || 0;
      const currentNoCount = newsItem.helpful?.no || 0;
      
      let newYesCount = currentYesCount;
      let newNoCount = currentNoCount;
      
      // If we previously voted yes and now changing to no or removing vote
      if (helpfulVote === 'yes' && newVoteValue !== 'yes') {
        newYesCount = Math.max(0, currentYesCount - 1);
      }
      
      // If we previously voted no and now changing to yes or removing vote
      if (helpfulVote === 'no' && newVoteValue !== 'no') {
        newNoCount = Math.max(0, currentNoCount - 1);
      }
      
      // If adding a new yes vote
      if (newVoteValue === 'yes' && helpfulVote !== 'yes') {
        newYesCount += 1;
      }
      
      // If adding a new no vote
      if (newVoteValue === 'no' && helpfulVote !== 'no') {
        newNoCount += 1;
      }
      
      // Send the updated values to the server
      const response = await fetch(`/api/news/${newsItem.slug}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          helpful: {
            yes: newYesCount,
            no: newNoCount
          }
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to update helpful vote');
        // Revert UI state if server request failed
        setHelpfulVote(helpfulVote);
        // Also revert localStorage if server request failed
        if (helpfulVote) {
          localStorage.setItem(`news-vote-${newsItem.slug}`, helpfulVote);
        } else {
          localStorage.removeItem(`news-vote-${newsItem.slug}`);
        }
      }
    } catch (error) {
      console.error('Error updating helpful vote:', error);
      // Revert UI state if there was an error
      setHelpfulVote(helpfulVote);
      // Also revert localStorage
      if (helpfulVote) {
        localStorage.setItem(`news-vote-${newsItem.slug}`, helpfulVote);
      } else {
        localStorage.removeItem(`news-vote-${newsItem.slug}`);
      }
    }
  };

  // Handle share
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: newsItem?.title,
          text: newsItem?.summary,
          url: typeof window !== 'undefined' ? window.location.href : '',
        })
        .catch((error) => console.log('Error sharing', error));
      } else {
        // Fallback - copy to clipboard
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(window.location.href);
        }
        alert('Link copied to clipboard!');
      }
    }
  };

  // No longer need this function since we're using the RichTextContent component
  // const renderContent = () => {
  //   return { __html: newsItem.content };
  // };

  if (!newsItem) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">News article not found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="default"
            onClick={() => router.push('/news')}
          >
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Table of Contents Overlay */}
      <AnimatePresence>
        {showTableOfContents && newsItem?.tableOfContents && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTableOfContents(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Table of Contents</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTableOfContents(false)}
                  className="p-1 h-auto"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-1">
                {newsItem.tableOfContents.map((item) => (
                  <div
                    key={item.id}
                    className={`pl-${(item.level - 1) * 4} py-2 border-l-2 ${
                      activeSection === item.id 
                        ? 'border-primary-600 text-primary-600 font-medium' 
                        : 'border-transparent hover:border-slate-300 text-slate-700'
                    } cursor-pointer transition-colors duration-200`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="mb-4">
          <Link 
            href="/news"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            {/* Hero section */}
            <div className="mb-8">
              {newsItem.image && (
                <div className="mb-6">
                  <img 
                    src={newsItem.image} 
                    alt={newsItem.title}
                    width="1200"
                    height="500"
                    className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" 
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {newsItem.category}
                  </span>
                  {newsItem.isFeatured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{newsItem.title}</h1>
                
                <p className="text-lg text-muted-foreground line-clamp-3">{newsItem.summary}</p>
                
                <div className="flex flex-wrap items-center text-muted-foreground gap-y-2 gap-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(newsItem.publishDate)}</span>
                  </div>
                  {newsItem.readingTime && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{newsItem.readingTime}</span>
                    </div>
                  )}
                  {newsItem.views !== undefined && (
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      <span>{newsItem.views} {newsItem.views === 1 ? 'view' : 'views'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table of contents toggle for mobile */}
            {newsItem.tableOfContents && newsItem.tableOfContents.length > 0 && (
              <div className="md:hidden mb-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center justify-between"
                  onClick={() => setShowTableOfContents(true)}
                >
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    <span>Table of Contents</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Summary section */}
            <div className="mb-8">
              <div className="bg-muted dark:bg-muted/30 border border-border rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-2 text-foreground">Summary</h2>
                <p className="text-foreground">{newsItem.summary}</p>
              </div>
            </div>
            
            {/* Main article content */}
            <div className="article-content mb-8">
              <RichTextContent content={newsItem.content} className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-headings:scroll-mt-20" />
            </div>

            {/* FAQs section */}
            {newsItem.faqs && newsItem.faqs.length > 0 && (
              <div className="my-10">
                <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="bg-muted dark:bg-muted/30 border border-border rounded-xl px-4">
                  {newsItem.faqs.map((faq, index) => (
                    <AccordionItem value={`faq-${index}`} key={index} className="border-b border-border last:border-0">
                      <AccordionTrigger className="hover:text-primary-600 dark:hover:text-primary-400 text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground">
                        <RichTextContent content={faq.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Interaction section: Helpful + Share */}
            <div className="border-t border-b border-border py-6 my-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <span className="mr-3 text-foreground">Was this article helpful?</span>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={helpfulVote === 'yes' ? 'default' : 'outline'}
                            size="sm"
                            className={`py-1 px-2 h-auto ${
                              helpfulVote === 'yes' ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600' : ''
                            }`}
                            onClick={() => handleHelpfulVote('yes')}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{helpfulVote === 'yes' ? (newsItem.helpful?.yes || 0) + 1 : newsItem.helpful?.yes || 0}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This was helpful</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={helpfulVote === 'no' ? 'default' : 'outline'}
                            size="sm"
                            className={`py-1 px-2 h-auto ${
                              helpfulVote === 'no' ? 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600' : ''
                            }`}
                            onClick={() => handleHelpfulVote('no')}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span>{helpfulVote === 'no' ? (newsItem.helpful?.no || 0) + 1 : newsItem.helpful?.no || 0}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This wasn't helpful</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleShare}
                          className="py-1 px-2 h-auto"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share this article</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="py-1 px-2 h-auto"
                        >
                          <BookmarkPlus className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save to read later</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Related articles section for mobile */}
            {relatedNewsData.length > 0 && (
              <div className="my-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Related News</h2>
                  <Link 
                    href="/news"
                    className="text-primary-600 dark:text-primary-400"
                  >
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNewsData.slice(0, 3).map((news) => (
                    <RelatedNewsCard key={news.id} newsItem={news} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Sidebar sticky content */}
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Table of contents */}
              {newsItem.tableOfContents && newsItem.tableOfContents.length > 0 && (
                <Card className="hidden md:block">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <List className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                      Table of Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {newsItem.tableOfContents.map((item) => (
                        <div
                          key={item.id}
                          className={`pl-${(item.level - 1) * 4} py-2 border-l-2 ${
                            activeSection === item.id 
                              ? 'border-primary-600 text-primary-600 font-medium' 
                              : 'border-transparent hover:border-slate-300 text-foreground/80 hover:text-foreground'
                          } cursor-pointer transition-colors duration-200`}
                          onClick={() => scrollToSection(item.id)}
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related articles for desktop */}
              {relatedNewsData.length > 0 && (
                <div className="hidden lg:block">
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="space-y-6">
                    {relatedNewsData.slice(0, 3).map((news) => (
                      <RelatedNewsCard key={news.id} newsItem={news} />
                    ))}
                  </div>
                </div>
              )}

              {/* Help card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground">Need Help?</CardTitle>
                  <CardDescription>
                    Our education consultants can help you navigate the international education landscape.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-0">
                  <Button
                    variant="default"
                    className="mb-4"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Book a Free Consultation
                  </Button>
                </CardContent>
              </Card>
              
              {/* Search card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground">Search News</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Type to search..." 
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                </CardContent>
                <CardFooter className="pb-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/news'}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse All News
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Latest news */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground">Latest News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {allNews.slice(0, 4).map((news) => (
                    <div
                      key={news.id}
                      className="flex gap-3 cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/20 p-2 rounded-lg transition-colors duration-200"
                      onClick={() => window.location.href = `/news/${news.slug}`}
                    >
                      {news.image && (
                        <div className="relative">
                          <img 
                            src={news.image}
                            alt={news.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2 text-foreground">{news.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(news.publishDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add ChatBot at the bottom of the page */}
      <ChatBot 
        title="Study Guru Assistant"
        subtitle="Got questions about this article?"
        initialMessage="Hi there! I'm here to help with any questions about this article or studying abroad in general. What would you like to know?"
        showContactInfo={true}
      />
    </>
  );
};

export default NewsDetailPage;