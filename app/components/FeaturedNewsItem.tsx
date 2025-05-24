'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface FeaturedNewsItemProps {
  title: string;
  summary: string;
  slug: string;
  publishDate: string;
  image: string;
  category: string;
}

const FeaturedNewsItem = ({
  title,
  summary,
  slug,
  publishDate,
  image,
  category
}: FeaturedNewsItemProps) => {
  return (
    <Link href={`/news/${slug}`} className="group cursor-pointer w-full block">
      <motion.div 
        className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-border w-full"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="h-64 md:h-80 overflow-hidden relative">
          <Image 
            src={image} 
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
            style={{ objectFit: 'cover' }}
            priority={false}
            className="group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {category}
            </span>
            <span className="text-muted-foreground text-xs ml-2">{formatDate(publishDate)}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground">{summary}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default FeaturedNewsItem;