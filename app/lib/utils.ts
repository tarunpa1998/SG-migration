import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTimeAgo(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/&/g, '-and-')       // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word characters
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function extractPlainTextFromHTML(html: string): string {
  if (!html) return '';
  
  // Create a temporary element
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  // Get the text content
  return tempElement.textContent || tempElement.innerText || '';
}

export function generateReadingTime(content: string): number {
  if (!content) return 0;
  
  // First, strip HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Average reading speed: 225 words per minute
  const wordsPerMinute = 225;
  const wordCount = plainText.trim().split(/\s+/).length;
  
  return Math.ceil(wordCount / wordsPerMinute);
}