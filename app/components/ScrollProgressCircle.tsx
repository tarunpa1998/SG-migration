'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollProgressCircle: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const circumference = 2 * Math.PI * 18; // 2πr where r=18
  const offset = circumference - (scrollPercentage / 100) * circumference;

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const newScrollPercentage = (window.scrollY / scrollHeight) * 100;
        setScrollPercentage(newScrollPercentage);
        setIsVisible(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="scroll-progress-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
        >
          <svg className="scroll-progress-circle" width="50" height="50" viewBox="0 0 50 50">
            <circle className="background" cx="25" cy="25" r="18" fill="transparent" />
            <circle
              style={{ strokeDashoffset: offset }}
              className="foreground"
              cx="25"
              cy="25"
              r="18"
              fill="transparent"
            />
          </svg>
          <div className="scroll-to-top-button">
            <ArrowUp className="h-5 w-5 text-primary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollProgressCircle;