'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Article {
  id: string | number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  image?: string;
  category: string;
  author?: string;
  readingTime?: string;
  tags?: string[];
}

interface ArticlesListProps {
  initialArticles: Article[];
}

export default function ArticlesList({ initialArticles }: ArticlesListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const articlesPerPage = 9;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  
  // Get unique categories
  const categories = [...new Set(articles.map(article => article.category))];
  
  // Handle URL parameter changes
  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    
    if (query !== null) setSearchQuery(query);
    if (category !== null) setSelectedCategory(category);
    
    filterArticles(query || searchQuery, category || selectedCategory);
  }, [searchParams]);
  
  // Filter articles based on search query and category
  const filterArticles = (query: string, category: string) => {
    let filtered = [...articles];
    
    if (query) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }
    
    if (category) {
      filtered = filtered.filter(article => article.category === category);
    }
    
    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    
    // Push new URL
    router.push(`/articles?${params.toString()}`);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    router.push('/articles');
  };
  
  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If there are many pages, use ellipsis
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      // Skip if already added (first or last page)
      if (i === 1 || i === totalPages) continue;
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // If there are many pages, use ellipsis
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Articles & Resources</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover comprehensive guides, expert tips, and in-depth resources to help you navigate your international education journey.
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className={`flex-1 md:flex items-center gap-2 ${showFilters ? 'flex' : 'hidden'}`}>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(searchQuery || selectedCategory) && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={clearFilters}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>
      
      {/* Results info */}
      {(searchQuery || selectedCategory) && (
        <div className="mb-6 text-sm text-muted-foreground">
          <p>
            Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}
            {searchQuery && <span> for "{searchQuery}"</span>}
            {selectedCategory && <span> in {selectedCategory}</span>}
          </p>
        </div>
      )}
      
      {/* Articles grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48 mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {getPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any articles matching your search criteria.
          </p>
          <Button onClick={clearFilters}>Clear filters</Button>
        </div>
      )}
    </div>
  );
}