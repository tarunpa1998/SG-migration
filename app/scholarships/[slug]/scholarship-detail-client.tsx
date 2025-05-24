'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CalendarClock, 
  MapPin, 
  ExternalLink, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  BookOpen, 
  BadgeCheck,
  Lightbulb, 
  Award,
  ListChecks,
  BarChart2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';

// Define the Scholarship type - matching Vite app structure
interface Scholarship {
  id: string | number;
  title: string;
  slug: string;
  overview?: string;
  description: string;
  highlights?: string[];
  
  amount: string;
  deadline: string;
  duration?: string;
  level?: string;
  fieldsCovered?: string[];
  eligibility?: string[] | string;
  isRenewable?: boolean;
  
  benefits?: string[];
  applicationProcedure?: string | string[];
  country: string;
  tags: string[];
  link?: string;
  content?: string;
}

const HighlightItem = ({ text }: { text: string }) => {
  return (
    <motion.div 
      className="flex items-start gap-3 p-3 bg-muted rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-0.5">
        <CheckCircle2 className="h-5 w-5 text-primary-500" />
      </div>
      <p className="text-foreground">{text}</p>
    </motion.div>
  );
};

interface ScholarshipDetailClientProps {
  scholarship: Scholarship;
  relatedScholarships: Scholarship[];
}

const ScholarshipDetailClient: React.FC<ScholarshipDetailClientProps> = ({ scholarship, relatedScholarships }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Function to get tag color based on tag name - just like in Vite app
  const getTagColor = (tag: string): string => {
    const tagColorMap: Record<string, string> = {
      "Fully Funded": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      "Graduate": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "Master's": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "PhD": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      "Research": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "Research-Based": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "Partial Aid": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "Undergraduate": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      "Need-Based": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      "Merit-Based": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
      "Govt Funded": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
      "Prestigious": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    };
    
    return tagColorMap[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: scholarship.title,
          text: scholarship.description,
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium p-0 h-auto"
          asChild
        >
          <Link href="/scholarships">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scholarships
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Header section */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{scholarship.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {scholarship.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2 text-primary-500" />
              <span className="font-medium">{scholarship.country}</span>
            </div>
          </div>

          {/* Overview section */}
          <div className="bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-900 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
              Overview
            </h2>
            <p className="text-foreground leading-relaxed">{scholarship.overview || scholarship.description}</p>
          </div>
          
          {/* Highlights section */}
          {scholarship.highlights && scholarship.highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Key Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scholarship.highlights.map((highlight, index) => (
                  <HighlightItem key={index} text={highlight} />
                ))}
              </div>
            </div>
          )}

          {/* Benefits section */}
          {scholarship.benefits && scholarship.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Benefits
              </h2>
              <ul className="space-y-2">
                {scholarship.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <BadgeCheck className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
              Description
            </h2>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              {scholarship.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* Application procedure section */}
          {scholarship.applicationProcedure && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                How to Apply
              </h2>
              <div className="bg-muted border border-border rounded-xl p-5">
                {Array.isArray(scholarship.applicationProcedure) ? (
                  <ol className="space-y-2 pl-5 list-decimal">
                    {scholarship.applicationProcedure.map((step, index) => (
                      <li key={index} className="text-foreground">{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-foreground">{scholarship.applicationProcedure}</p>
                )}
              </div>
            </div>
          )}

          {/* Apply button */}
          {scholarship.link && (
            <div className="mb-8">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a 
                  href={scholarship.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scholarship details card */}
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle>Scholarship Details</CardTitle>
              <CardDescription>Key information about this scholarship</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-2 text-primary-500" />
                    <span>Value</span>
                  </div>
                  <span className="font-semibold text-accent-foreground">{scholarship.amount}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarClock className="h-5 w-5 mr-2 text-primary-500" />
                    <span>Deadline</span>
                  </div>
                  <span className="font-semibold">{scholarship.deadline}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-2 text-primary-500" />
                    <span>Duration</span>
                  </div>
                  <span className="font-semibold">{scholarship.duration}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center text-muted-foreground">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary-500" />
                    <span>Level</span>
                  </div>
                  <span className="font-semibold">{scholarship.level}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                    <span>Country</span>
                  </div>
                  <span className="font-semibold">{scholarship.country}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center text-muted-foreground">
                    <BadgeCheck className="h-5 w-5 mr-2 text-primary-500" />
                    <span>Renewable</span>
                  </div>
                  <span className="font-semibold">{scholarship.isRenewable ? 'Yes' : 'No'}</span>
                </div>
              </div>
              
              {/* Field of study */}
              {scholarship.fieldsCovered && scholarship.fieldsCovered.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2 text-foreground">Fields Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.fieldsCovered.map((field, index) => (
                      <Badge key={index} variant="outline" className="bg-muted">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Eligibility criteria */}
              <div className="mt-6">
                <h3 className="font-medium mb-2 text-foreground">Eligibility Criteria</h3>
                {Array.isArray(scholarship.eligibility) ? (
                  <ul className="space-y-1 pl-5 list-disc text-muted-foreground text-sm">
                    {scholarship.eligibility.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">{scholarship.eligibility}</p>
                )}
              </div>
              
              {/* Apply button */}
              {scholarship.link && (
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <a 
                      href={scholarship.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related scholarships card */}
          {relatedScholarships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Scholarships</CardTitle>
                <CardDescription>More opportunities in {scholarship.country}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedScholarships.map((related) => (
                    <motion.div 
                      key={related.id}
                      className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-all duration-300"
                      whileHover={{ y: -5 }}
                      onClick={() => window.location.href = `/scholarships/${related.slug}`}
                    >
                      <h3 className="font-medium text-foreground mb-1 line-clamp-2">{related.title}</h3>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-muted-foreground">{related.amount}</span>
                        <span className="text-primary font-medium">View Details</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/scholarships">
                    Browse All Scholarships
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this scholarship</DialogTitle>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScholarshipDetailClient;