'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  MapPin, 
  GraduationCap, 
  Building, 
  Wallet, 
  Users, 
  ArrowRight,
  Calendar,
  Bookmark,
  ChevronRight,
  Share2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import ChatBot from '@/components/ChatBot';

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

interface CountryDetailClientProps {
  country: Country;
}

const CountryDetailClient: React.FC<CountryDetailClientProps> = ({ country }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Study in ${country.name}`,
          text: country.description,
          url: window.location.href,
        });
      } else {
        setShareDialogOpen(true);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setShareDialogOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // Could add a toast notification here
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {country.imageUrl ? (
          <Image
            src={country.imageUrl}
            alt={`Study in ${country.name}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600" />
        )}
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <Link href="/countries" className="text-white/90 hover:text-white text-sm font-medium flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Countries
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Study in {country.name}</h1>
            <p className="text-white/90 text-lg max-w-2xl">{country.description}</p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button className="bg-white text-primary-600 hover:bg-white/90" asChild>
                <Link href="/contact">
                  Get Free Counseling
                </Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="universities">Universities</TabsTrigger>
                <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {/* Render HTML content safely */}
                  <div 
                    dangerouslySetInnerHTML={{ __html: country.content || `<p>Detailed information about studying in ${country.name} is coming soon.</p>` }} 
                  />
                </div>
                
                {/* Why Study Here Section */}
                <div className="bg-card border border-border rounded-xl p-6 mt-8">
                  <h2 className="text-2xl font-bold mb-6">Why Study in {country.name}?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">World-Class Education</h3>
                        <p className="text-muted-foreground">Access to top-ranked universities and diverse academic programs.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Cultural Experience</h3>
                        <p className="text-muted-foreground">Immerse yourself in a rich cultural environment and expand your global perspective.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Career Opportunities</h3>
                        <p className="text-muted-foreground">Gain international work experience and improve your career prospects.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="universities" className="mt-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Top Universities in {country.name}</h2>
                  <p className="text-muted-foreground">
                    Explore the leading educational institutions in {country.name} for international students.
                  </p>
                </div>
                
                {country.universities && country.universities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    {country.universities.map((university, index) => (
                      <motion.div
                        key={index}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = `/universities/${university.slug}`}
                      >
                        <div className="p-5 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-primary/10">
                                <Building className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">{university.name}</h3>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-lg">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Universities Found</h3>
                    <p className="text-muted-foreground mb-4">We're adding more universities soon.</p>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Us for Help</Link>
                    </Button>
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <Button asChild>
                    <Link href={`/search?q=${country.name}&type=universities`}>
                      View All Universities in {country.name}
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="scholarships" className="mt-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Scholarships for {country.name}</h2>
                  <p className="text-muted-foreground">
                    Discover funding opportunities for international students in {country.name}.
                  </p>
                </div>
                
                {country.scholarships && country.scholarships.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    {country.scholarships.map((scholarship, index) => (
                      <motion.div
                        key={index}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = `/scholarships/${scholarship.slug}`}
                      >
                        <div className="p-5 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-primary/10">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">{scholarship.title}</h3>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-lg">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Scholarships Found</h3>
                    <p className="text-muted-foreground mb-4">We're adding more scholarships soon.</p>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Us for Help</Link>
                    </Button>
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <Button asChild>
                    <Link href={`/search?q=${country.name}&type=scholarships`}>
                      View All Scholarships for {country.name}
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Call to Action */}
            <div className="bg-primary text-white rounded-xl p-8 text-center mt-10">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-primary-100 mb-6">Get personalized guidance on studying in {country.name}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-white text-primary-600 hover:bg-white/90" asChild>
                  <Link href="/contact">
                    Contact an Advisor
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href={`/search?q=${country.name}&type=scholarships`}>
                    Find Scholarships
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Chat Bot */}
            <div className="mt-12">
              <ChatBot 
                initialMessage={`Do you have questions about studying in ${country.name}? I'm here to help!`}
                useStudyAbroadFlow={true}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Country Facts Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{country.name} at a Glance</CardTitle>
                  <CardDescription>Key information for students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Location</h4>
                      <p className="text-sm text-muted-foreground">{country.continent || 'Global'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Universities</h4>
                      <p className="text-sm text-muted-foreground">
                        {country.universities?.length || 'Multiple'} top universities
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Scholarships</h4>
                      <p className="text-sm text-muted-foreground">
                        {country.scholarships?.length || 'Various'} opportunities available
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Language</h4>
                      <p className="text-sm text-muted-foreground">English programs available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Cost of Living</h4>
                      <p className="text-sm text-muted-foreground">Varies by city and region</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">International Students</h4>
                      <p className="text-sm text-muted-foreground">Welcoming environment</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <div className="w-full border-t border-border pt-4 text-center">
                    <Button className="w-full" asChild>
                      <Link href="/contact">
                        Get Expert Guidance
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Quick Links Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Explore More</CardTitle>
                  <CardDescription>Helpful resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        href={`/search?q=${country.name}+universities&type=universities`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Universities in {country.name}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/search?q=${country.name}&type=scholarships`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Scholarships for {country.name}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/search?q=visa+${country.name}`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Visa Requirements
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/search?q=cost+of+living+${country.name}`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Cost of Living
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Study in {country.name}</DialogTitle>
            <DialogDescription>
              Copy the link below or share directly to social media
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <input 
              type="text" 
              value={typeof window !== 'undefined' ? window.location.href : ''}
              readOnly
              className="flex-1 px-3 py-2 border border-input bg-background rounded-md"
            />
            <Button onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Social Media Sharing Buttons could go here */}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CountryDetailClient;