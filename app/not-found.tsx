import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Study Guru',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-[75vh] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-6 mb-4 text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
          We couldn&apos;t find the page you were looking for. It might have been removed, renamed, or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}