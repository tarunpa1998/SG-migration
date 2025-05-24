'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MapPin, 
  Award, 
  Check, 
  Calendar, 
  GraduationCap, 
  Globe, 
  DollarSign, 
  Clock, 
  Users, 
  BookOpen,
  Building,
  Star,
  Share2,
  School,
  Home,
  Briefcase,
  ChevronRight,
  Info,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import ChatBot from '@/components/ChatBot';

// Types
interface University {
  id: number | string;
  name: string;
  description: string;
  content?: string;
  imageUrl?: string;
  country: string;
  countrySlug?: string;
  slug: string;
  website?: string;
  ranking?: number;
  foundedYear?: number;
  programs?: { name: string; level: string; duration: string }[];
  scholarships?: { title: string; slug: string }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  acceptanceRate?: string;
  studentPopulation?: number;
  internationalStudents?: string;
  overview?: string;
  facilities?: string[];
  highlights?: string[];
  tuitionFees?: {
    international?: string;
    domestic?: string;
  };
  admissionRequirements?: string;
}

interface Scholarship {
  id: number | string;
  title: string;
  description: string;
  content?: string;
  amount: string;
  deadline: string;
  country: string;
  tags: string[];
  slug: string;
}

interface UniversityDetailClientProps {
  university: University;
  scholarships: Scholarship[];
}

const UniversityDetailClient: React.FC<UniversityDetailClientProps> = ({ 
  university, 
  scholarships 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Filter scholarships to ensure they don't include any already in university.scholarships
  const universityScholarshipSlugs = university.scholarships?.map(s => s.slug) || [];
  const additionalScholarships = scholarships.filter(
    s => !universityScholarshipSlugs.includes(s.slug)
  ).slice(0, 3);

  const allScholarships = [
    ...(university.scholarships || []),
    ...additionalScholarships.map(s => ({ title: s.title, slug: s.slug }))
  ];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: university.name,
          text: university.description,
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
        {university.imageUrl ? (
          <Image
            src={university.imageUrl}
            alt={university.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600" />
        )}
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="container mx-auto px-4 h-full flex items-end relative z-10 pb-8 md:pb-12">
          <div className="max-w-3xl">
            <Link href="/universities" className="text-white/90 hover:text-white text-sm font-medium flex items-center mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Universities
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{university.name}</h1>
            <div className="flex flex-wrap items-center text-white/90 text-sm md:text-base gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{university.country}</span>
              </div>
              {university.ranking && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  <span>Rank #{university.ranking}</span>
                </div>
              )}
              {university.foundedYear && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Est. {university.foundedYear}</span>
                </div>
              )}
              {university.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <a 
                    href={university.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline"
                  >
                    Official Website
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button className="bg-white text-primary-600 hover:bg-white/90" asChild>
                <Link href="/contact">
                  Apply Now
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
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="admissions">Admissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                {/* University Overview */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="lead text-xl text-foreground font-medium">{university.description}</p>
                  
                  {/* Render HTML content safely */}
                  <div 
                    dangerouslySetInnerHTML={{ __html: university.content || university.overview || `<p>Detailed information about ${university.name} is coming soon.</p>` }} 
                  />
                </div>
                
                {/* Facility/Highlights Section */}
                {(university.highlights || university.facilities) && (
                  <div className="mt-10 bg-card border border-border rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6">University Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {university.highlights?.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-foreground">{highlight}</p>
                        </div>
                      ))}
                      {university.facilities?.map((facility, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-foreground">{facility}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Scholarships Section */}
                {allScholarships.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Scholarships for {university.country} Students</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {allScholarships.map((scholarship, index) => (
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
                    
                    <div className="mt-4 text-center">
                      <Button variant="outline" className="w-full md:w-auto" asChild>
                        <Link href={`/search?q=${university.country}&type=scholarships`}>
                          View All Scholarships for {university.country}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="programs" className="mt-6">
                {university.programs && university.programs.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Programs at {university.name}</h2>
                    <p className="text-muted-foreground mb-6">
                      Browse academic programs available at this university. Contact our counselors for more information about admission requirements.
                    </p>
                    
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">Program</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">Level</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {university.programs.map((program, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                              <td className="px-4 py-3 text-foreground">{program.name}</td>
                              <td className="px-4 py-3 text-foreground">{program.level}</td>
                              <td className="px-4 py-3 text-foreground">{program.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-lg">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Programs Listed</h3>
                    <p className="text-muted-foreground mb-4">Program details will be added soon.</p>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Us for More Info</Link>
                    </Button>
                  </div>
                )}
                
                {/* Tuition Fees */}
                {(university.tuitionFees?.international || university.tuitionFees?.domestic) && (
                  <div className="mt-10 bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Tuition Fees</h2>
                    <div className="space-y-4">
                      {university.tuitionFees.international && (
                        <div className="flex justify-between py-2 border-b border-border">
                          <span className="text-muted-foreground">International Students</span>
                          <span className="font-medium">{university.tuitionFees.international}</span>
                        </div>
                      )}
                      {university.tuitionFees.domestic && (
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Domestic Students</span>
                          <span className="font-medium">{university.tuitionFees.domestic}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        * Tuition fees may vary by program and academic year. Please check the university website for the most up-to-date information.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="admissions" className="mt-6">
                {university.admissionRequirements ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Admission Requirements</h2>
                    <p className="text-muted-foreground mb-6">
                      Below are the general requirements for international students applying to {university.name}. Requirements may vary by program.
                    </p>
                    
                    <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                      <div dangerouslySetInnerHTML={{ __html: university.admissionRequirements }} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-lg">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">Admission Information Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">We're working on gathering detailed admission requirements.</p>
                    <Button variant="outline" asChild>
                      <Link href="/contact">Contact Us for Assistance</Link>
                    </Button>
                  </div>
                )}
                
                {/* FAQ Section */}
                <div className="mt-10">
                  <h2 className="text-xl font-bold mb-4">Common Questions About Studying in {university.country}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What are the language requirements?</AccordionTrigger>
                      <AccordionContent>
                        <p>International students typically need to demonstrate proficiency in English through standardized tests like IELTS (usually 6.0-7.0) or TOEFL (usually 80-100). Some programs may have higher requirements.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What documents are required for application?</AccordionTrigger>
                      <AccordionContent>
                        <p>Generally, you'll need academic transcripts, language test scores, a statement of purpose, letters of recommendation, and a copy of your passport. Some programs may require additional documents like portfolios or test scores.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How much does it cost to study at {university.name}?</AccordionTrigger>
                      <AccordionContent>
                        <p>Tuition fees vary by program. International students typically pay between {university.tuitionFees?.international || "USD 10,000-30,000"} per year, plus living expenses. Financial aid and scholarships may be available.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Call to Action */}
            <div className="bg-primary text-white rounded-xl p-8 text-center mt-10">
              <h2 className="text-2xl font-bold mb-4">Ready to Apply to {university.name}?</h2>
              <p className="text-primary-100 mb-6">Get personalized guidance from our expert counselors</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-white text-primary-600 hover:bg-white/90" asChild>
                  <Link href="/contact">
                    Contact an Advisor
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href={`/search?q=${university.country}&type=scholarships`}>
                    Find Scholarships
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Chat Bot */}
            <div className="mt-12">
              <ChatBot 
                initialMessage={`Do you have questions about studying at ${university.name}? I'm here to help!`}
                useStudyAbroadFlow={true}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* University Stats Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>University Overview</CardTitle>
                  <CardDescription>Key facts about {university.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">{university.country}</p>
                    </div>
                  </div>
                  
                  {university.ranking && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                        <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ranking</p>
                        <p className="font-semibold text-foreground">#{university.ranking} Globally</p>
                      </div>
                    </div>
                  )}
                  
                  {university.foundedYear && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p className="font-semibold text-foreground">{university.foundedYear}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Programs</p>
                      <p className="font-semibold text-foreground">
                        {university.programs?.length || 'Various'} offered
                      </p>
                    </div>
                  </div>
                  
                  {university.studentPopulation && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                        <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Student Population</p>
                        <p className="font-semibold text-foreground">
                          {university.studentPopulation.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {university.acceptanceRate && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <Star className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                        <p className="font-semibold text-foreground">{university.acceptanceRate}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  {university.website && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={university.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Official Website
                      </a>
                    </Button>
                  )}
                  
                  <Button className="w-full" asChild>
                    <Link href="/contact">
                      Get Expert Guidance
                    </Link>
                  </Button>
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
                        href={`/search?q=${university.country}+universities&type=universities`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        More Universities in {university.country}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/search?q=${university.country}&type=scholarships`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Scholarships in {university.country}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href={`/countries/${university.countrySlug || university.country.toLowerCase()}`}
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Study in {university.country} Guide
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/contact"
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Accommodation Assistance
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
            <DialogTitle>Share {university.name}</DialogTitle>
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

export default UniversityDetailClient;