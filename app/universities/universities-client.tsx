'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Globe, MapPin, Building, Trophy, School, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Types
interface University {
  id: number | string;
  name: string;
  description: string;
  country: string;
  countrySlug?: string;
  imageUrl?: string;
  slug: string;
  featured?: boolean;
  ranking?: number;
}

interface UniversitiesClientProps {
  initialUniversities: University[];
  featuredUniversities: University[];
  topRankedUniversities: University[];
  universitiesByCountry: Record<string, University[]>;
}

const UniversitiesClient = ({ 
  initialUniversities, 
  featuredUniversities,
  topRankedUniversities,
  universitiesByCountry 
}: UniversitiesClientProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>(initialUniversities);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Effect to handle filtering
  useEffect(() => {
    let results = initialUniversities;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(university => 
        university.name.toLowerCase().includes(term) || 
        university.description.toLowerCase().includes(term) ||
        university.country.toLowerCase().includes(term)
      );
    }
    
    // Apply country filter
    if (activeCountry) {
      results = results.filter(university => 
        university.country === activeCountry
      );
    }
    
    // Apply tab filter
    if (activeTab === "featured") {
      results = results.filter(university => university.featured);
    } else if (activeTab === "ranked") {
      results = results.filter(university => university.ranking)
        .sort((a, b) => (a.ranking || 0) - (b.ranking || 0));
    }
    
    setFilteredUniversities(results);
  }, [initialUniversities, searchTerm, activeCountry, activeTab]);

  // For framer-motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Get unique countries for filters
  const countries = Object.keys(universitiesByCountry).sort();

  return (
    <div>
      {/* Featured Universities Section */}
      {featuredUniversities.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Featured Universities</h2>
            <Link href="#all-universities">
              <Button variant="ghost" className="gap-2">
                View All <Trophy className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredUniversities.slice(0, 3).map((university) => (
              <motion.div 
                key={university.id} 
                className="group relative overflow-hidden rounded-xl shadow-md border border-border h-64 bg-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 z-10" />
                
                {university.imageUrl ? (
                  <div className="absolute inset-0">
                    <Image 
                      src={university.imageUrl} 
                      alt={university.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900" />
                )}
                
                <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{university.name}</h3>
                  <div className="flex items-center text-white/80 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{university.country}</span>
                    {university.ranking && (
                      <>
                        <span className="mx-2">•</span>
                        <Trophy className="h-4 w-4 mr-1" />
                        <span>Rank: #{university.ranking}</span>
                      </>
                    )}
                  </div>
                  <p className="text-white/90 text-sm line-clamp-2 mb-4">{university.description}</p>
                  <Link href={`/universities/${university.slug}`}>
                    <Button 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      Learn More <School className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
      
      {/* Tabs and Search Section */}
      <div id="all-universities" className="mb-8">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="bg-muted h-10">
              <TabsTrigger value="all" className="h-8">All Universities</TabsTrigger>
              <TabsTrigger value="featured" className="h-8">Featured</TabsTrigger>
              <TabsTrigger value="ranked" className="h-8">Top Ranked</TabsTrigger>
            </TabsList>
            
            {/* Search input */}
            <div className="relative w-full md:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-border bg-background pl-10 pr-4 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
          
          {/* Country filters */}
          <div className="bg-card rounded-lg p-4 mb-8 shadow-sm border border-border">
            <div className="flex flex-wrap gap-2 items-center">
              <Globe className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm font-medium text-muted-foreground mr-2">Filter by country:</span>
              
              <Button
                variant={activeCountry === null ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setActiveCountry(null)}
              >
                All Countries
              </Button>
              
              {countries.map((country) => (
                <Button
                  key={country}
                  variant={activeCountry === country ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setActiveCountry(activeCountry === country ? null : country)}
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <TabsContent value="all" className="mt-0">
            <UniversitiesList universities={filteredUniversities} />
          </TabsContent>
          
          <TabsContent value="featured" className="mt-0">
            <UniversitiesList 
              universities={filteredUniversities.length > 0 ? filteredUniversities : featuredUniversities} 
            />
          </TabsContent>
          
          <TabsContent value="ranked" className="mt-0">
            <UniversitiesList 
              universities={filteredUniversities.length > 0 ? filteredUniversities : topRankedUniversities} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Component to display list of universities
const UniversitiesList = ({ universities }: { universities: University[] }) => {
  // For framer-motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  if (universities.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <div className="mx-auto w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No universities found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {universities.map((university) => (
        <motion.div 
          key={university.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-card rounded-xl shadow-md overflow-hidden border border-border transition-all duration-300 hover:shadow-lg"
        >
          <div className="h-48 relative overflow-hidden">
            {university.imageUrl ? (
              <Image 
                src={university.imageUrl} 
                alt={university.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <School className="h-12 w-12 text-white/80" />
              </div>
            )}
            {university.ranking && (
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 rounded-full px-2 py-1 text-xs font-bold flex items-center shadow-md backdrop-blur-sm">
                <Trophy className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-foreground">Rank #{university.ranking}</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{university.name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{university.description}</p>
            
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              {university.countrySlug ? (
                <Link href={`/countries/${university.countrySlug}`} className="hover:text-primary hover:underline">
                  {university.country}
                </Link>
              ) : (
                <span>{university.country}</span>
              )}
            </div>
            
            <Link href={`/universities/${university.slug}`}>
              <Button className="w-full">
                View University
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UniversitiesClient;