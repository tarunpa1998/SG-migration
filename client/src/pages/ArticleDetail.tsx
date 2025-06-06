import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
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
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import RichTextContent from "@/components/RichTextContent";
import ChatBot from "@/components/ChatBot";

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

// Related article card component
const RelatedArticleCard = ({ article }: { article: Article }) => {
  const { theme } = useTheme();
  
  const handleClick = () => {
    window.location.href = `/articles/${article.slug}`;
  };

  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {article.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            width="800"
            height="160"
            loading="eager"
            fetchPriority="high"
            decoding="async"
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

const ArticleDetail = () => {
  const { theme } = useTheme();
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  // Initialize helpful vote from localStorage if available
  const [helpfulVote, setHelpfulVote] = useState<'yes' | 'no' | null>(() => {
    if (typeof window !== 'undefined') {
      const savedVote = localStorage.getItem(`article-vote-${slug}`);
      return (savedVote === 'yes' || savedVote === 'no') ? savedVote : null;
    }
    return null;
  });
  const [relatedArticlesData, setRelatedArticlesData] = useState<Article[]>([]);
  
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
  });

  // Update view count when article loads
  useEffect(() => {
    if (article && article.slug) {
      // Increment view count in the database
      fetch(`/api/articles/${article.slug}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .catch(error => console.error('Error updating view count:', error));
    }
  }, [article?.slug]);

  // Fetch related articles data when article is loaded
  useEffect(() => {
    if (article?.relatedArticles && article.relatedArticles.length > 0) {
      const fetchRelatedArticles = async () => {
        try {
          const slugs = article.relatedArticles || [];
          const promises = slugs.map(async (relatedSlug) => {
            const response = await fetch(`/api/articles/${relatedSlug}`);
            if (response.ok) {
              return await response.json();
            }
            return null;
          });
          
          const results = await Promise.all(promises);
          setRelatedArticlesData(results.filter(Boolean));
        } catch (error) {
          console.error("Error fetching related articles:", error);
        }
      };
      
      fetchRelatedArticles();
    }
  }, [article]);

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
    if (!article?.tableOfContents) return;
    
    const handleScroll = () => {
      // Safely access tableOfContents
      const tocItems = article.tableOfContents || [];
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
  }, [article]);

  // Handle helpful votes
  const handleHelpfulVote = async (vote: 'yes' | 'no') => {
    if (!article) return;
    
    // Toggle vote if clicking the same button
    const newVoteValue = helpfulVote === vote ? null : vote;
    setHelpfulVote(newVoteValue);
    
    // Store vote in localStorage
    if (newVoteValue) {
      localStorage.setItem(`article-vote-${slug}`, newVoteValue);
    } else {
      localStorage.removeItem(`article-vote-${slug}`);
    }
    
    try {
      // Calculate the new vote counts - if removing a vote, decrement current value
      const currentYesCount = article.helpful?.yes || 0;
      const currentNoCount = article.helpful?.no || 0;
      
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
      const response = await fetch(`/api/articles/${slug}/helpful`, {
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
      
      if (response.ok) {
        // Update local state with the new values
        const updatedArticle = { 
          ...article, 
          helpful: { 
            yes: newYesCount, 
            no: newNoCount 
          } 
        };
        
        // Update article in the UI without refetching
        // @ts-ignore - we know this property exists
        article.helpful = {
          yes: newYesCount,
          no: newNoCount
        };
      } else {
        console.error('Failed to update helpful vote');
        // Revert UI state if server request failed
        setHelpfulVote(helpfulVote);
        // Also remove from localStorage if server request failed
        if (helpfulVote) {
          localStorage.setItem(`article-vote-${slug}`, helpfulVote);
        } else {
          localStorage.removeItem(`article-vote-${slug}`);
        }
      }
    } catch (error) {
      console.error('Error updating helpful vote:', error);
      // Revert UI state if there was an error
      setHelpfulVote(helpfulVote);
      // Also revert localStorage
      if (helpfulVote) {
        localStorage.setItem(`article-vote-${slug}`, helpfulVote);
      } else {
        localStorage.removeItem(`article-vote-${slug}`);
      }
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Article</h1>
        <p className="text-muted-foreground mb-6">We couldn't load this article. Please try again later.</p>
        <Button variant="outline" onClick={() => window.location.href = '/articles'}>
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <>
      {article && (
        <Helmet>
          <title>{article.seo?.metaTitle || `${article.title} | Study Guru`}</title>
          <meta name="description" content={article.seo?.metaDescription || article.summary} />
          <meta property="og:title" content={article.seo?.metaTitle || `${article.title} | Study Guru`} />
          <meta property="og:description" content={article.seo?.metaDescription || article.summary} />
          <meta property="og:type" content="article" />
          {article.image && <meta property="og:image" content={article.image} />}
          {article.seo?.keywords && <meta name="keywords" content={article.seo.keywords.join(', ')} />}
          
          {/* Add structured data for better SEO */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.title,
              "description": article.summary,
              "image": article.image || "",
              "author": {
                "@type": "Person",
                "name": article.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Study Guru",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://studyguru.com/logo.png"
                }
              },
              "datePublished": article.publishDate,
              "dateModified": article.publishDate,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
              }
            })}
          </script>
        </Helmet>
      )}

      {/* Mobile Table of Contents Overlay */}
      <AnimatePresence>
        {showTableOfContents && article?.tableOfContents && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTableOfContents(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
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
                {article.tableOfContents.map((item) => (
                  <div
                    key={item.id}
                    className={`pl-${(item.level - 1) * 4} py-2 border-l-2 ${
                      activeSection === item.id 
                        ? 'border-primary-600 text-primary-600 font-medium' 
                        : 'border-transparent hover:border-border text-foreground'
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
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium p-0 h-auto"
            onClick={() => window.location.href = '/articles'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </div>

        {isLoading ? (
          <div>
            <Skeleton className="h-48 md:h-64 w-full mb-6 rounded-lg" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center mb-6 gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        ) : article ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content */}
            <div className="lg:col-span-8">
              {/* Hero section */}
              <div className="mb-8">
                {article.image && (
                  <div className="mb-6">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      width="1200"
                      height="400"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-auto rounded-xl shadow-md object-cover max-h-[400px]" 
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {article.category}
                    </span>
                    {article.isFeatured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{article.title}</h1>

                  {/* Article meta */}
                  <div className="flex flex-wrap justify-between items-center text-muted-foreground gap-y-3">
                    <div className="flex items-center">
                      {article.authorImage ? (
                        <img 
                          src={article.authorImage} 
                          alt={article.author}
                          width="40"
                          height="40"
                          loading="lazy"
                          decoding="async"
                          className="h-10 w-10 rounded-full mr-2 border-2 border-border shadow-sm" 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full mr-2 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-foreground">{article.author}</div>
                        {article.authorTitle && (
                          <div className="text-xs text-muted-foreground">{article.authorTitle}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.publishDate)}</span>
                      </div>
                      
                      {article.readingTime && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.readingTime}</span>
                        </div>
                      )}
                      
                      {article.views !== undefined && (
                        <div className="flex items-center text-muted-foreground">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table of contents toggle for mobile */}
                  {article.tableOfContents && article.tableOfContents.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="md:hidden flex items-center"
                      onClick={() => setShowTableOfContents(true)}
                    >
                      <List className="h-4 w-4 mr-2" />
                      Table of Contents
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-8">
                <div className="bg-muted border border-border rounded-xl p-5">
                  <h2 className="text-lg font-semibold mb-2">Summary</h2>
                  <p className="text-foreground">{article.summary}</p>
                </div>
              </div>

              {/* Main article content */}
              <div className="article-content mb-8">
                <RichTextContent content={article.content} />
              </div>

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
                                helpfulVote === 'yes' ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white' : ''
                              }`}
                              onClick={() => handleHelpfulVote('yes')}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{helpfulVote === 'yes' ? (article.helpful?.yes || 0) + 1 : article.helpful?.yes || 0}</span>
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
                                helpfulVote === 'no' ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white' : ''
                              }`}
                              onClick={() => handleHelpfulVote('no')}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              <span>{helpfulVote === 'no' ? (article.helpful?.no || 0) + 1 : article.helpful?.no || 0}</span>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="py-1 px-2 h-auto"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="py-1 px-2 h-auto"
                      onClick={() => window.print()}
                    >
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {article.faqs && article.faqs.length > 0 && (
                <div className="my-10">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="bg-muted border border-border rounded-xl px-4">
                    {article.faqs.map((faq, index) => (
                      <AccordionItem 
                        value={`faq-${index}`} 
                        key={index} 
                        className="border-b dark:border-gray-500 border-border last:border-0 data-[state=open]:pb-2"
                      >
                        <AccordionTrigger className="hover:text-primary-600 dark:hover:text-primary-400">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

<Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground">Need Help?</CardTitle>
                    <CardDescription>Chat with our education advisor</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-0">
                    <ChatBot 
                      title="Study Guru Chat"
                      subtitle="Ask about this article"
                      initialMessage="Hi there! Have questions about this news article?"
                      showContactInfo={true}
                      className="mb-4"
                      useStudyAbroadFlow={false}
                    />
                  </CardContent>
                </Card>

              {/* Related Articles */}
              {relatedArticlesData.length > 0 && (
                <div className="my-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      onClick={() => window.location.href = `/articles?category=${encodeURIComponent(article.category)}`}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedArticlesData.map((relatedArticle) => (
                      <RelatedArticleCard
                        key={relatedArticle.id}
                        article={relatedArticle}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* Table of Contents - Desktop */}
                {article.tableOfContents && article.tableOfContents.length > 0 && (
                  <Card className="hidden md:block">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <List className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                        Table of Contents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {article.tableOfContents.map((item) => (
                          <motion.div
                            key={item.id}
                            className={`pl-${(item.level - 1) * 4} py-2 border-l-2 ${
                              activeSection === item.id 
                                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium' 
                                : 'border-transparent hover:border-border text-foreground'
                            } cursor-pointer transition-colors duration-200`}
                            onClick={() => scrollToSection(item.id)}
                            whileHover={{ x: 3 }}
                          >
                            {item.title}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Author Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                      About the Author
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center">
                    {article.authorImage ? (
                      <img 
                        src={article.authorImage} 
                        alt={article.author} 
                        className="h-16 w-16 rounded-full mr-4 border-2 border-border shadow-sm" 
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full mr-4 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-lg text-foreground">{article.author}</div>
                      {article.authorTitle && (
                        <div className="text-sm text-muted-foreground">{article.authorTitle}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                

                {/* Search articles card */}
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
                      onClick={() => window.location.href = '/articles'}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse All Articles
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
            <Button 
              onClick={() => window.location.href = '/articles'}
            >
              Back to Articles
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleDetail;






