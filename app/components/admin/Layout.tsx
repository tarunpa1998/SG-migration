'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Globe, 
  Building, 
  Newspaper, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const isMobile = !useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Re-open sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Navigation items
  const navItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard'
    },
    { 
      title: 'Articles', 
      icon: <BookOpen className="h-5 w-5" />, 
      href: '/admin/articles',
      active: pathname?.startsWith('/admin/articles')
    },
    { 
      title: 'Scholarships', 
      icon: <GraduationCap className="h-5 w-5" />, 
      href: '/admin/scholarships',
      active: pathname?.startsWith('/admin/scholarships')
    },
    { 
      title: 'Countries', 
      icon: <Globe className="h-5 w-5" />, 
      href: '/admin/countries',
      active: pathname?.startsWith('/admin/countries')
    },
    { 
      title: 'Universities', 
      icon: <Building className="h-5 w-5" />, 
      href: '/admin/universities',
      active: pathname?.startsWith('/admin/universities')
    },
    { 
      title: 'News', 
      icon: <Newspaper className="h-5 w-5" />, 
      href: '/admin/news',
      active: pathname?.startsWith('/admin/news')
    },
    { 
      title: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      href: '/admin/settings',
      active: pathname?.startsWith('/admin/settings')
    },
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'lg:translate-x-0' : ''}`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="relative h-8 w-8">
                <Image src="/logo.svg" alt="Study Guru" fill sizes="32px" />
              </div>
              <h1 className="ml-2 text-xl font-bold">Study Guru</h1>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          <Separator />

          {/* Navigation links */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                  item.active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.title}
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Mobile header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mr-2 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/')}
              >
                View Website
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}