'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-4 flex items-center">
          <Logo width={40} height={40} withText={true} />
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/scholarships" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Scholarships
            </Link>
            <Link href="/countries" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Countries
            </Link>
            <Link href="/universities" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Universities
            </Link>
            <Link href="/articles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Articles
            </Link>
            <Link href="/news" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              News
            </Link>
          </nav>
          
          <button 
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;