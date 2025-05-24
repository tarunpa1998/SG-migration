import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Globe, Book, Users, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Study Guru',
  description: 'Learn about Study Guru - your trusted guide to international education opportunities.',
  keywords: 'about study guru, international education, study abroad guidance, education consultants',
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-primary-600 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 dark:from-primary-800 dark:via-primary-700 dark:to-primary-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-400 rounded-full opacity-20 filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400 rounded-full opacity-20 filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About Study Guru</h1>
            <p className="text-xl text-primary-50 mb-8">Your trusted partner in international education since 2015</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 flex items-center">
                <GraduationCap className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-lg font-bold">5000+</div>
                  <div className="text-xs">Students Assisted</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 flex items-center">
                <Globe className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-lg font-bold">150+</div>
                  <div className="text-xs">Countries Covered</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 flex items-center">
                <Users className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-lg font-bold">50+</div>
                  <div className="text-xs">Expert Counselors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Story</h2>
            <div className="prose prose-slate dark:prose-invert mx-auto">
              <p className="lead text-xl text-muted-foreground text-center mb-8">
                Founded with a mission to make quality education accessible to students worldwide.
              </p>
              
              <p>
                Study Guru began in 2015 with a simple mission: to help international students navigate the complex world of global education opportunities. What started as a small team of education enthusiasts has grown into a comprehensive platform serving thousands of students across the globe.
              </p>
              
              <p>
                Our journey has been guided by a commitment to accuracy, accessibility, and student success. We believe that education is a transformative force, and our platform aims to remove barriers that prevent talented students from accessing world-class educational opportunities.
              </p>
              
              <p>
                Today, Study Guru is proud to offer comprehensive information on scholarships, universities, and study destinations, paired with personalized guidance from experienced counselors who understand the unique challenges of studying abroad.
              </p>
              
              <blockquote>
                "Education is the passport to the future, and we're committed to helping students chart their course to success, regardless of their background or circumstances."
                <footer>— The Study Guru Team</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  At Study Guru, we're committed to democratizing access to global education opportunities through:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Comprehensive Information</h3>
                      <p className="text-muted-foreground">Providing accurate, up-to-date information on scholarships, universities, and study destinations.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Educational Guidance</h3>
                      <p className="text-muted-foreground">Offering expert advice and resources to help students make informed decisions about their education.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Community Building</h3>
                      <p className="text-muted-foreground">Creating a supportive community of international students and education professionals.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="relative h-80 lg:h-full min-h-[320px] rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
                  alt="Students studying together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
              Have questions or want to learn more about our services? Our team is here to help you navigate your educational journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">For general inquiries and information</p>
                <a href="mailto:info@studyguruindia.com" className="text-primary hover:underline font-medium">
                  info@studyguruindia.com
                </a>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-4">Speak directly with our counselors</p>
                <a href="tel:+919876543210" className="text-primary hover:underline font-medium">
                  +91 9876 543 210
                </a>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-md transition-all">
                <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Visit Us</h3>
                <p className="text-muted-foreground mb-4">Schedule an in-person consultation</p>
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}